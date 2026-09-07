// components/MobileSidebarDrawer.tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import { SidebarBrand, SidebarAddPetButton, SidebarNav, SidebarBottom } from "./SidebarNav";

const DRAWER_WIDTH = 280;

type MobileSidebarDrawerProps = {
    open: boolean;
    onClose: () => void;
};

export function MobileSidebarDrawer({ open, onClose }: MobileSidebarDrawerProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-backdrop md:hidden"
                        aria-hidden
                    />

                    <motion.aside
                        key="drawer"
                        initial={{ x: -DRAWER_WIDTH }}
                        animate={{ x: 0 }}
                        exit={{ x: -DRAWER_WIDTH }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        style={{ width: DRAWER_WIDTH }}
                        className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-separator bg-surface md:hidden"
                    >
                        <div className="flex items-center justify-between px-3 pt-3">
                            <div className="flex-1" />
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close menu"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary hover:text-foreground"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <SidebarBrand collapsed={false} onNavigate={onClose} />
                        <SidebarAddPetButton collapsed={false} onNavigate={onClose} />
                        <SidebarNav collapsed={false} onNavigate={onClose} />
                        <SidebarBottom collapsed={false} onNavigate={onClose} />
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}