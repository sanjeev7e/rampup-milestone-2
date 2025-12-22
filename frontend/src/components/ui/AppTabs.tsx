import Tab, { type TabProps } from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList, { type TabListProps } from "@mui/lab/TabList";
import TabPanel, { type TabPanelProps } from "@mui/lab/TabPanel";
import {
  type SyntheticEvent,
  type ReactNode,
  type ComponentProps,
} from "react";
import { cn } from "../../utils/cn";

export interface AppTabItem
  extends Omit<TabProps, "value" | "label" | "content"> {
  label: string;
  value: string;
  content: ReactNode;
  /** Props passed to the specific TabPanel for this item */
  tabPanelProps?: Omit<TabPanelProps, "value" | "children">;
}

export interface AppTabsProps {
  value: string;
  onChange: (event: SyntheticEvent, newValue: string) => void;
  tabs: AppTabItem[];
  ariaLabel?: string;
  className?: string;
  /** Props passed to the TabList component */
  tabListProps?: Omit<TabListProps, "onChange" | "aria-label" | "children">;
  /** Props passed to the div wrapper around TabList */
  boxProps?: ComponentProps<"div">;
  otherActions?: ReactNode;
}

export default function AppTabs({
  value,
  onChange,
  tabs,
  ariaLabel = "App Tabs",
  className,
  tabListProps,
  boxProps,
  otherActions,
}: AppTabsProps) {
  return (
    <div className={className}>
      <TabContext value={value}>
        <div
          {...boxProps}
          className={cn(
            "flex justify-between items-center",
            boxProps?.className
          )}
        >
          <TabList onChange={onChange} aria-label={ariaLabel} {...tabListProps}>
            {tabs.map((tab) => {
              const {
                label,
                value,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                content: _content,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                tabPanelProps: _tabPanelProps,
                ...tabProps
              } = tab;
              return (
                <Tab key={value} label={label} value={value} {...tabProps} />
              );
            })}
          </TabList>
          {otherActions}
        </div>
        {tabs.map((tab) => (
          <TabPanel
            key={tab.value}
            value={tab.value}
            {...tab.tabPanelProps}
            className={cn("p-0! pt-6!", tab.tabPanelProps?.className)}
          >
            {tab.content}
          </TabPanel>
        ))}
      </TabContext>
    </div>
  );
}
