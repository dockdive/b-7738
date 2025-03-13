import { Headset, Percent, Box, Calculator, ChartLine, Edit, Server, Palette, List, Sailboat } from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  pricing: "Free Trial" | "Freemium" | "Paid";
  description: string;
  tags: string[];
  category: string;
  featured: boolean;
  dealUrl?: string;
  visitUrl: string;
  bookmarks: number;
};

export const categories = [
  { name: "Shipping Companies", icon: Sailboat },
  { name: "Port Authorities", icon: Sailboat },
  { name: "Maritime Logistics", icon: Sailboat },
  { name: "Shipbuilding & Repair", icon: Sailboat },
  { name: "Marine Equipment Suppliers", icon: Sailboat },
  { name: "Maritime Consultants", icon: Sailboat },
  { name: "Training & Education", icon: Sailboat },
  { name: "Legal & Insurance Services", icon: Sailboat },
  { name: "Environmental Services", icon: Sailboat },
  { name: "Offshore Services", icon: Sailboat },
  { name: "Customs Brokerage", icon: Sailboat },
  { name: "Freight Forwarding", icon: Sailboat },
  { name: "Cargo Handling", icon: Sailboat },
  { name: "Vessel Management", icon: Sailboat },
  { name: "Maritime IT Solutions", icon: Sailboat },
  { name: "Navigation & Communication", icon: Sailboat },
  { name: "Marine Engineering", icon: Sailboat },
  { name: "Safety & Compliance", icon: Sailboat },
  { name: "Sailboat Finance", icon: Sailboat },
  { name: "Port Operations", icon: Sailboat },
  { name: "Marine Surveying", icon: Sailboat },
  { name: "Digital Shipping Platforms", icon: Sailboat },
  { name: "Crew Management", icon: Sailboat },
  { name: "Maritime Recruitment", icon: Sailboat },
  { name: "Marine Research", icon: Sailboat },
  { name: "Sailboat Chartering", icon: Sailboat },
  { name: "Maritime Arbitration", icon: Sailboat },
  { name: "Marine Security", icon: Sailboat },
  { name: "Bulk Cargo Specialists", icon: Sailboat },
  { name: "Container Logistics", icon: Sailboat },
  { name: "Offshore Construction", icon: Sailboat },
  { name: "Port Logistics Software", icon: Sailboat },
  { name: "Maritime Data Analytics", icon: Sailboat },
  { name: "Vessel Tracking", icon: Sailboat },
  { name: "Sailboat Efficiency Consulting", icon: Sailboat },
  { name: "Marine Waste Management", icon: Sailboat },
  { name: "Port Maintenance Services", icon: Sailboat },
  { name: "International Trade Compliance", icon: Sailboat },
  { name: "Supply Chain Finance", icon: Sailboat },
  { name: "Maritime Marketing", icon: Sailboat },
];
