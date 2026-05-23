import React from "react";
import { FiSearch } from "react-icons/fi";
import Input from "../common/Input";

function FilterBar({
  search,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <Input
          placeholder="Tìm theo tên, email hoặc SĐT..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11"
          leftIcon={<FiSearch size={18} />}
        />
      </div> 
    </div>
  );
}
export default FilterBar;
