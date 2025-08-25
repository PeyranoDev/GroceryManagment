import { Search } from "lucide-react";
import Input from "../ui/input/Input";

const ProductSearch = ({ 
  searchTerm, 
  searchResults, 
  onSearchChange, 
  onAddProduct 
}) => {
  return (
    <div className="flex items-center gap-3">
      <Search size={22} />
      <div className="relative">
        <Input
          placeholder="Escriba el nombre del producto..."
          value={searchTerm}
          onChange={onSearchChange}
          className="!w-75"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#141312] border border-[#1C1B19] rounded-md shadow-lg max-h-60 overflow-y-auto">
            <ul>
              {searchResults.map((p) => (
                <li
                  key={p.id}
                  onClick={() => onAddProduct(p)}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span>{p.name}</span>
                    <span className="text-sm text-gray-500">
                      ${p.unitPrice}/{p.unit}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;