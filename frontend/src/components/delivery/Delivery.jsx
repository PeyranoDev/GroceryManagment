import { Copy, MessageSquareQuote } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { mockSaleProducts } from "../../data/products";
import Card from "../ui/card/Card";

const Delivery = () => {
  const [showOfferGenerator, setShowOfferGenerator] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [generatedOfferMessage, setGeneratedOfferMessage] = useState("");

  const availableProducts = useMemo(
    () => mockSaleProducts.filter((p) => p.stock > 0),
    []
  );

  useEffect(() => {
    const initialSelection = {};
    availableProducts.forEach((p) => {
      initialSelection[p.id] = true;
    });
    setSelectedProducts(initialSelection);
  }, [availableProducts]);

  const displayOfferGenerator = () => {
    setGeneratedOfferMessage("");
    setShowOfferGenerator(!showOfferGenerator);
  };
  const generateOfferMessage = () => {
    setShowOfferGenerator(false);
    const currentDate = new Date();
    const formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;

    let message = `🌿 Tomillo Verdulería\n🛒 Lista de precios - Envío ${formattedDate}\n📞 Pedidos al 3413632198\n\n`;

    const selectedProductsByCategory = {};
    availableProducts.forEach((product) => {
      if (selectedProducts[product.id]) {
        if (!selectedProductsByCategory[product.category]) {
          selectedProductsByCategory[product.category] = [];
        }
        selectedProductsByCategory[product.category].push(product);
      }
    });

    const categoryOrder = [
      "Frutas Tropicales",
      "Frutas Cítricas",
      "Frutas de Huerta",
      "Frutas Exóticas",
      "Otros",
      "Verduras y Hortalizas",
      "Pimiento",
      "Frutas",
      "Verduras Raíz",
      "Verduras de Hoja",
      "Verduras de Tallo",
      "Verduras de Flor",
      "Fuego",
    ];

    categoryOrder.forEach((category) => {
      if (
        selectedProductsByCategory[category] &&
        selectedProductsByCategory[category].length > 0
      ) {
        message += `${category}\n`;

        selectedProductsByCategory[category].forEach((product) => {
          const priceFormatted = `$${product.salePrice.toLocaleString()}`;
          let productLine = `${product.emoji} ${product.name} (${product.unit}): ${priceFormatted}`;

          if (product.promotion) {
            const promoPrice = `$${product.promotion.price.toLocaleString()}`;
            productLine += ` | ${product.promotion.quantity}x${promoPrice}`;
          }

          message += `${productLine}\n`;
        });

        message += "\n";
      }
    });

    setGeneratedOfferMessage(message);
  };

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("¡Mensaje copiado!"));
  };

  return (
    <div className="space-y-6">
      {/* Header del generador de ofertas */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={22} /> Generador de Mensajes para
              Difusión
            </div>
          </div>
        }
        actions={
          <button
            onClick={() => displayOfferGenerator()}
            className="btn-secondary"
          >
            Generador de Ofertas
          </button>
        }
      >
        {showOfferGenerator && (
          <div className="space-y-6">
            {/* Sección de selección de productos por categoría */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-200">
                  Productos disponibles
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allSelected = {};
                      availableProducts.forEach(
                        (p) => (allSelected[p.id] = true)
                      );
                      setSelectedProducts(allSelected);
                    }}
                    className="px-3 py-1 text-xs bg-green-900/50 hover:bg-green-900 text-green-300 rounded-md transition-colors"
                  >
                    Seleccionar todos
                  </button>
                  <button
                    onClick={() => setSelectedProducts({})}
                    className="px-3 py-1 text-xs bg-red-900/50 hover:bg-red-900 text-red-300 rounded-md transition-colors"
                  >
                    Deseleccionar todos
                  </button>
                </div>
              </div>

              <div className="bg-[#141312] rounded-lg border border-black max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {(() => {
                    const productsByCategory = availableProducts.reduce(
                      (acc, product) => {
                        const category = product.category || "Sin categoría";
                        if (!acc[category]) {
                          acc[category] = [];
                        }
                        acc[category].push(product);
                        return acc;
                      },
                      {}
                    );

                    return Object.entries(productsByCategory).map(
                      ([category, products]) => (
                        <div key={category} className="pb-4 last:pb-0">
                          {/* Header de categoría */}
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-md font-semibold text-gray-300 flex items-center gap-2">
                              <span className="text-lg">
                                {products[0]?.emoji || "📦"}
                              </span>
                              {category}
                              <span className="text-xs bg-green-800 text-white px-2 py-1 rounded-full">
                                {products.length}
                              </span>
                            </h4>
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  const categorySelected = {};
                                  products.forEach(
                                    (p) => (categorySelected[p.id] = true)
                                  );
                                  setSelectedProducts((prev) => ({
                                    ...prev,
                                    ...categorySelected,
                                  }));
                                }}
                                className="px-2 py-1 text-xs bg-blue-900/50 hover:bg-blue-900 text-blue-300 rounded transition-colors"
                              >
                                Todos
                              </button>
                              <button
                                onClick={() => {
                                  const categoryDeselected = {
                                    ...selectedProducts,
                                  };
                                  products.forEach(
                                    (p) => delete categoryDeselected[p.id]
                                  );
                                  setSelectedProducts(categoryDeselected);
                                }}
                                className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 rounded transition-colors"
                              >
                                Ninguno
                              </button>
                            </div>
                          </div>

                          {/* Grid de productos de la categoría */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                            {products.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => handleProductSelection(p.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all duration-200 ${
                                  selectedProducts[p.id]
                                    ? "border-green-600 bg-green-900/20"
                                    : "border-[#302E2B] bg-black hover:border-gray-800"
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                                      selectedProducts[p.id]
                                        ? "border-green-500 bg-green-500"
                                        : "border-gray-500"
                                    }`}
                                  >
                                    {selectedProducts[p.id] && (
                                      <svg
                                        className="w-2.5 h-2.5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="text-sm">{p.emoji}</span>
                                    <span className="font-medium text-gray-100 text-xs truncate">
                                      {p.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                      {p.unit}
                                    </span>
                                    <span className="text-xs font-semibold text-green-400">
                                      ${p.salePrice.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Botón de generar */}
            <div className="flex justify-center">
              <button
                onClick={generateOfferMessage}
                disabled={Object.values(selectedProducts).every((v) => !v)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
              >
                <MessageSquareQuote size={20} />
                Generar Mensaje de Ofertas
              </button>
            </div>
          </div>
        )}
        {/* Resultado del mensaje */}
        {generatedOfferMessage && (
          <div className="  rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Copy size={20} className="text-blue-400" />
              Mensaje generado
            </h3>
            <div className="bg-[#141312] mb-4 rounded-lg  overflow-hidden">
              <textarea
                readOnly
                value={generatedOfferMessage}
                className="w-full h-64 p-4 bg-transparent border-none resize-none font-mono text-sm text-gray-200 focus:outline-none"
              />
            </div>
            <button
              onClick={() => copyToClipboard(generatedOfferMessage)}
              className="flex items-center gap-2 btn-primary"
            >
              <Copy size={16} />
              Copiar mensaje
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Delivery;
