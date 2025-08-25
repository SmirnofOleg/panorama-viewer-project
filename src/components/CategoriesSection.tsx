import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoriesSectionProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoriesSection = ({ categories, activeCategory, onCategoryChange }: CategoriesSectionProps) => {
  return (
    <section className="px-6 mb-12">
      <div className="container mx-auto">
        <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-sm">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
};

export default CategoriesSection;