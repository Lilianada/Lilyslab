import { DraftAccordionItem } from "@/components/draft-accordion-item"; // Adjust path if needed

// Define data structure (or import if defined elsewhere)
interface DraftItemData {
  id: string;
  initial: string;
  name: string;
  company: string;
  quote: string;
  title: string;
  statusColor: 'green' | 'red' | 'blue' | 'gray';
}

// Sample data (replace with your actual data source/fetch logic)
const draftItems: DraftItemData[] = [
  {
    id: '1',
    initial: 'C',
    name: 'Chester Chipperfield',
    company: 'Running Tide',
    quote: 'James is one of the rare talents that harmonizes design and technology. Very few designers are technical enough to generate viable product ideas, but James does.',
    title: 'Head of Product at Running Tide',
    statusColor: 'green',
  },
  {
    id: '2',
    initial: 'K',
    name: 'Kevin Robinson',
    company: 'LVLY',
    quote: 'James has a rare combination of skills. He knows tech backwards and forwards but speaks like a human. He’s clear, communicative, professional, and highly talented. His UI/UX aesthetic is bar none. And working with him all amounts to the most important thing of all. Trust.',
    title: 'Founder / Creative Director at Juniper Jones',
    statusColor: 'gray', // No visible dot in the "open" example
  },
  {
    id: '3',
    initial: 'D',
    name: 'Danny Crichton',
    company: 'Lux Capital',
    quote: 'James is exceptional at creative yet functional designs for the web. His user interfaces are incredibly intuitive and beautiful. Highly recommended.',
    title: 'Editor-in-Chief at TechCrunch',
    statusColor: 'red',
  },
  {
    id: '4',
    initial: 'F',
    name: 'Frank Shi',
    company: 'Paper Triangles',
    quote: 'Working with James was one of the best experiences I’ve had. He has an amazing eye for detail and ensures the user experience is prioritized. A true professional.',
    title: 'Founder at Paper Triangles',
    statusColor: 'blue',
  },
  {
    id: '5',
    initial: 'H',
    name: 'Heather Beserra',
    company: 'Running Tide',
    quote: 'James helped us build a complex, interactive site that aligned with a new brand launch, and we couldn’t be happier with the results. His technical skill and design sense are top-notch.',
    title: 'Marketing Lead at Running Tide',
    statusColor: 'green',
  },
];

export default function DraftPage() {
  return (
    // Main container for the draft page - apply dark theme background
    <div className="min-h-screen text-neutral-300 py-12">
       <div className="max-w-2xl mx-auto">
         <h1 className="text-2xl font-semibold text-neutral-100 px-4 mb-6">Drafts</h1>
         {/* Accordion Container */}
         <div className="border border-neutral-800 rounded-lg overflow-hidden">
           {draftItems.map((item, index) => (
             <DraftAccordionItem
               key={item.id}
               initial={item.initial}
               name={item.name}
               company={item.company}
               quote={item.quote}
               title={item.title}
               statusColor={item.statusColor}
               // Example: Start the second item open, like in the screenshot
               startOpen={item.id === '2'}
             />
           ))}
         </div>
       </div>
     </div>
  );
}