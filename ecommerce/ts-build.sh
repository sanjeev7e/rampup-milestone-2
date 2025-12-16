#!/bin/bash

# Get the root directory where node_modules is located
ROOT_DIR="$(pwd)"
TSC_BIN="$ROOT_DIR/node_modules/typescript/bin/tsc"

# Build a specific service
build_service() {
  local interface=$1
  local service=$2
  local service_dir="services/$interface/$service"
  local tsconfig="$service_dir/tsconfig.json"

  # Check if tsconfig.json exists
  if [ ! -f "$tsconfig" ]; then
    echo "Skipping $service (no tsconfig.json found)"
    return
  fi

  # Navigate to the service directory and build
  echo "Building $service..."
  (cd "$service_dir" && "$TSC_BIN" --project tsconfig.json)
  if [ $? -eq 0 ]; then
    echo "Build successful for $service."
  else
    echo "Build failed for $service."
  fi
}

build_resources() {
  local resources_dir="resources/$interface"
  local tsconfig="tsconfig.json"

  # Check if tsconfig.json exists
  if [ ! -f "$tsconfig" ]; then
    echo "Skipping resources (no tsconfig.json found)"
    return
  fi

  # Copy lib files and entities before building
  copy_lib_and_entities "$resources_dir"

  # Navigate to the resources directory and build
  echo "Building resources..."
  (cd "$resources_dir" && "$TSC_BIN" --project "$tsconfig")
  if [ $? -eq 0 ]; then
    echo "Build successful for resources."
  else
    echo "Build failed for resources."
  fi

  # Delete the copied folders
  delete_lib_and_entities "$resources_dir"
}

# Iterate through all services
build_all_services() {
  for service in services/$interface/*; do
    if [ -d "$service" ]; then
      build_service "$interface" "$(basename "$service")"
    fi
  done
}

# Main logic
if [ "$#" -gt 0 ]; then
  if [ "$#" -gt 1 ]; then
    interface=$1
    specific_service=$2
    # Build specific services or resources if arguments are provided
    if [ "$specific_service" == "resources" ]; then
      build_resources "$interface"
    elif [ -d "services/$interface/$specific_service" ]; then
      build_service "$interface" "$specific_service"
    else
      echo "Service or resource '$specific_service' does not exist."
    fi
  else
    interface=$1
    echo "Building all services and resources as no arguments provided for Specific Service."
    # Default: Build all services and resources
    build_resources "$interface"
    build_all_services "$interface"
  fi
else
  echo "Please specify a interface name (Eg: Admin_Web / Sub_Distributor_Mobile etc)."
fi

