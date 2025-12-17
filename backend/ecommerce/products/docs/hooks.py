# hooks.py for Dredd
# Add custom Dredd hooks for products here

def before_each(transaction):
    print(f"Running Dredd hook for {transaction['name']}")
