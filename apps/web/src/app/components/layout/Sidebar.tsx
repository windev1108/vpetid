// components/Sidebar.tsx
"use client";

import { motion } from "motion/react";
import { Tooltip, ToggleButton } from "@heroui/react";
import {
    SidebarBrand,
    SidebarAddPetButton,
    SidebarNav,
    SidebarBottom,
} from "./SidebarNav";

const EXPANDED_WIDTH = 248;
const COLLAPSED_WIDTH = 76;

type SidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

// Desktop-only sidebar: fixed, collapsible via width animation
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-separator bg-surface md:flex"
        >
            <SidebarBrand collapsed={collapsed} />
            {/* <SidebarAddPetButton collapsed={collapsed} /> */}
            <SidebarNav collapsed={collapsed} />
            <SidebarBottom collapsed={collapsed} />

            <Tooltip delay={200}>
                <Tooltip.Trigger>
                    <ToggleButton
                        isSelected={collapsed}
                        onChange={onToggle}
                        isIconOnly
                        variant="default"
                        size="sm"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="absolute right-0 top-1/2 z-50 h-7 w-7 -translate-y-1/2 translate-x-1/2 rounded-full border border-separator bg-surface text-muted shadow-[0_2px_8px_rgba(15,23,42,0.12)] data-[selected=true]:bg-surface data-[selected=true]:text-muted hover:text-foreground"
                    >
                        <motion.span
                            animate={{ rotate: collapsed ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="material-symbols-outlined text-[18px]"
                        >
                            chevron_left
                        </motion.span>
                    </ToggleButton>
                </Tooltip.Trigger>
                <Tooltip.Content placement="right" offset={10}>
                    {collapsed ? "Expand sidebar" : "Collapse sidebar"}
                </Tooltip.Content>
            </Tooltip>
        </motion.aside>
    );
}