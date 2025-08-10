import { useState } from "react";
import { Calendar, Download, Save } from 'lucide-react'
import Input from "../ui/input/Input";

const PurchasesHeader = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <div className="flex justify-between items-center p-4 rounded-lg  mb-3 bg-[#FFFFFF] shadow">
      <div>
        <h1 className="text-2xl font-bold ">Registro de Compras</h1>
        <p className="">Gestión de productos y promociones de venta</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Calendar
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 "
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="pl-10 border"
          />
        </div>
        <button className="flex items-center gap-2 border font-semibold py-2 px-4 rounded-md">
          <Save size={18} /> Guardar
        </button>
        <button className="btn-primary flex items-center gap-2   rounded-md text-white bg-[#2563EB] hover:bg-[#2d445a]">
          <Download size={18} /> Exportar
        </button>
      </div>
    </div>
  );
};

export default PurchasesHeader;
