// components/MainLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";
import { ProtectedTopBar } from "./ProtectedTopBar";
import { usePathname } from "@/i18n/navigation";
import { isProtectedPath, WITHOUT_LAYOUT_ROUTES } from "@/lib/routes";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const EXPANDED_WIDTH = 248;
const COLLAPSED_WIDTH = 76;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = isProtectedPath(pathname);
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isWithoutLayout = WITHOUT_LAYOUT_ROUTES.some((x) => pathname.startsWith(x))
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  if (showSidebar) {
    // Chỉ đẩy content ở desktop — sidebar desktop là fixed + chiếm chỗ thật.
    // Mobile: sidebar là drawer overlay nên content không cần margin.
    const contentMarginLeft = isDesktop ? (collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH) : 0;

    return (
      <div className="flex min-h-screen bg-background text-foreground overflow-y-hidden">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <MobileSidebarDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <motion.div
          initial={false}
          animate={{ marginLeft: contentMarginLeft }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex min-h-screen w-full min-w-0 flex-1 flex-col xs:container"
        >
          <ProtectedTopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="w-full min-w-0 flex-1 overflow-y-auto">{children}</main>
        </motion.div>
      </div>
    );
  }

  if (isWithoutLayout) {
    return (
      <main className="flex-1 w-full">{children}</main>
    )
  }
  return (
    <div className="flex  flex-col bg-background pt-16 text-foreground">
      <Navbar />
      <main className="flex-1 w-full overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
}