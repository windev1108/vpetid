export type SidebarNavItem = {
    icon: string;
    label: string;
    href: string;
    active?: boolean;
};

export const sidebarNavItems: SidebarNavItem[] = [
    { icon: "dashboard", label: "Dashboard", href: "#" },
    { icon: "pets", label: "My Pets", href: "#", active: true },
    { icon: "badge", label: "Digital IDs", href: "#" },
    { icon: "health_and_safety", label: "Health Tracker", href: "#" },
    { icon: "settings", label: "Settings", href: "#" },
];

export const petTabs = [
    {
        id: "overview",
        label: "Overview",
        icon: "summary",
    },
    {
        id: "identity",
        label: "Identity",
        icon: "identity",
    },
    // {
    //     id: "tracking",
    //     label: "Tracking",
    //     icon: "location_searching",
    // },
    {
        id: "schedule",
        label: "Vaccination schedule",
        icon: 'schedule',
    },
    // {
    //     id: "passport",
    //     label: "Passport",
    //     icon: "badge",
    // },
];

export type PetTabId = (typeof petTabs)[number]["id"];

export type QuickStat = {
    icon: string;
    label: string;
    value: string;
    highlight?: string;
    tone: "secondary" | "tertiary";
};

// NOTE: Location/GPS và Health (vaccination, weight) chưa có trong Pet API hiện tại
// (xem features/pets/types.ts) — đây là dữ liệu placeholder để giữ layout, thay bằng
// hook thật (ví dụ usePetLocation(petCode), usePetHealthStats(petCode)) khi backend
// có endpoint tương ứng.
export const placeholderLocation = {
    address: "Home Network Area",
    detail: "124 Maple Street, Apartment 4B. Device is connected to Home Wi-Fi.",
    updatedAgo: "2 mins ago via VPet Smart Collar",
    batteryPercent: 78,
    mapImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5gBuLjhXjQqmtIdnwIrjS7lG1-DwLzjcqPib7RYCGYl4cGAirSPP6SWou64AYm6eXgw-b_YYb-Ns8uMAHoybniCCrwI4fWZk0dwGnU1EmhhK0VJ5XEHAeYTUiTMJqBdNjBkmyrOVyPt9wdn4FK9IPb1FHaMYil7Zc_fHoGVW5zb7iJsVcnLbnak1kx-nh8XC6Fl2pc4BiwA0khUbtOuMD_Y0_Hn0uPYY7Ym3_YT1xdiIlpKSKp24W1g",
};

export const placeholderQuickStats: QuickStat[] = [
    {
        icon: "vaccines",
        label: "Next Vaccination",
        value: "Rabies • Oct 15",
        tone: "secondary",
    },
    {
        icon: "monitor_weight",
        label: "Weight Goal",
        value: "4.2 kg",
        highlight: "On Track",
        tone: "tertiary",
    },
];