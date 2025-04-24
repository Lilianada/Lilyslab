import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion";

// Types (can be moved to a central types file later if needed)
export interface WorkItem {
  id: string
  company: string
  role: string
  period: string
  description: string
}

export interface ProjectItem {
  id: string
  img: string
}

// Using 'any' for now as the original data source (speaking) might not be correct
export interface ThingItem {
  id: string
  name: string
  description: string
}


export const WorkItemComponent = ({
  company,
  role,
  period,
}: Omit<WorkItem, 'id' | 'description'>) => { // Exclude unused description for now
  return (
    <div className="flex justify-between items-center gap-4  opacity-0 animate-slide-up transition-colors duration-300">
      <div className="flex">
        <span className="font-medium text-sm text-foreground">{company}</span>
        <span className="hidden sm:flex text-sm text-muted-foreground ml-2">{role}</span>
      </div>
      <div className="flex-grow border-b border-border mx-2 mb-1"></div>
      <p className="text-xs sm:text-sm text-muted-foreground font-mono">{period}</p>
    </div>
  )
}

export const ProjectItemComponent = ({
  img,
}: Omit<ProjectItem, 'id'>) => {
  return (
    <div className="opacity-0 animate-slide-up hover:border-primary transition-colors duration-300 w-32 h-32">
      <div className=" rounded-lg border border-1 border-neutral-300 bg-muted object-contain">
        <Image src={img} width={128} height={128}  className="rounded-lg object-contain" alt="Project Image" />
      </div>
    </div>
  )
}
// export const ProjectItemComponent = ({
//   name,
//   description,
//   url,
// }: Omit<ProjectItem, 'id'>) => {
//   return (
//     <div className="space-y-6 opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
//       <a
//         href={url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="group block rounded-lg border p-4 transition-colors hover:bg-accent"
//       >
//         <div className="flex items-center justify-between">
//           <h3 className="font-medium group-hover:text-primary text-sm">{name}</h3>
//           <ExternalLink
//             size={16}
//             className="text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
//           />
//         </div>
//         <p className="mt-1 text-xs text-muted-foreground">{description}</p>
//       </a>
//     </div>
//   )
// }

// Renamed from ThingsComponent to avoid conflict
export const ThingItemComponent = ({ name, description }: Omit<ThingItem, 'id'>) => {
  return (
    <div className="opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <h3 className="text-sm font-medium">
        {name}
      </h3>
      <p className="text-xs">{description}</p>
    </div>
  )
}



export const ProjectStack = ({ projects }: { projects: { img: string; id: string | number }[] }) => {
  // Rotation angles for the stack
  const rotations = [7, -7, 7, -7];
  // Offsets and image sizes for mobile and desktop
  const mobileOffset = 50;
  const desktopOffset = 100;
  const mobileSize = 90;
  const desktopSize = 150;

  return (
    <div className="opacity-0 animate-slide-up hover:border-primary transition-colors duration-300 relative flex h-28 w-[220px] sm:h-40 sm:w-[600px] mx-auto mt-6">
      {projects.map((item, i) => (
        <motion.div
          key={item.id}
          className="absolute left-0 top-0 cursor-pointer"
          style={{
            zIndex: i + 1,
            left: `calc(${i} * var(--proj-offset, ${mobileOffset}px))`,
            rotate: `${rotations[i % rotations.length]}deg`,
          }}
          whileHover={{
            scale: 1.05,
            zIndex: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="block sm:hidden">
            <Image
              src={item.img}
              width={mobileSize}
              height={mobileSize}
              alt={`Project ${i + 1}`}
              className="rounded-xl border border-neutral-300 bg-muted object-cover shadow-md transition-transform duration-300"
              style={{ pointerEvents: "auto" }}
            />
          </div>
          <div className="hidden sm:block">
            <Image
              src={item.img}
              width={desktopSize}
              height={desktopSize}
              alt={`Project ${i + 1}`}
              className="rounded-xl border border-neutral-300 bg-muted object-cover shadow-md transition-transform duration-300"
              style={{ pointerEvents: "auto" }}
            />
          </div>
        </motion.div>
      ))}
      {/* CSS variable for offset, responsive in Tailwind */}
      <style jsx>{`
        @media (min-width: 640px) {
          :global(.relative.flex) {
            --proj-offset: ${desktopOffset}px;
          }
        }
        @media (max-width: 639px) {
          :global(.relative.flex) {
            --proj-offset: ${mobileOffset}px;
          }
        }
      `}</style>
    </div>
  );
};

export const SocialLink = ({ platform, url, action }: { platform: string; url: string; action: string }) => {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 opacity-0 animate-slide-up hover:border-primary transition-colors duration-300">
      <span className="text-xs">{platform}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-primary hover:underline group"
      >
        {action}
        <ExternalLink
          size={12}
          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
        />
      </a>
    </div>
  )
}
