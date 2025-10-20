import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Dynamically retrieves a Lucide icon component by its string name.
 * Handles various naming conventions (kebab-case, snake_case) and provides fallbacks.
 * @param iconName The string name of the icon (e.g., "briefcase", "graduation-cap").
 * @returns The LucideIcon component or null if not found.
 */
export function getLucideIcon(iconName: string): LucideIcons.LucideIcon | null {
  if (!iconName) return null;

  // Convert kebab-case or snake_case to PascalCase for Lucide component names
  const pascalCaseName = iconName
    .toLowerCase()
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Try to find the icon in the LucideIcons export
  // @ts-ignore - LucideIcons is a module, not a direct object with string keys
  const IconComponent = LucideIcons[pascalCaseName];

  if (IconComponent) {
    return IconComponent;
  }

  // Fallback for common icons if specific name not found
  if (iconName.includes('book')) return LucideIcons.BookOpen;
  if (iconName.includes('user')) return LucideIcons.Users;
  if (iconName.includes('award')) return LucideIcons.Award;
  if (iconName.includes('school')) return LucideIcons.School;
  if (iconName.includes('briefcase')) return LucideIcons.Briefcase;
  if (iconName.includes('globe')) return LucideIcons.Globe;
  if (iconName.includes('graduation')) return LucideIcons.GraduationCap;

  return null; // Return null if no icon found
}