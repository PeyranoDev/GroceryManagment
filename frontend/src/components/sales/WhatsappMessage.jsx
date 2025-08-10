import { useState } from "react";
import { Copy, MessageCircle, Check } from "lucide-react";
import Modal from "../ui/modal/Modal";

const WhatsAppMessage = ({ 
  cart,
  details,
  total,
  deliveryCost,
  isOpen,
  onClose 
}) => {
  const [copied, setCopied] = useState(false);

  const generateMessage = () => {
    if (!details || cart.length === 0) return "";

    const customerName = details.client || "Cliente";
    const address = details.address || "";
    const phone = details.phone || "";
    
    let message = `¡Hola ${customerName}! 👋\n\n`;
    message += `Resumen de tu pedido:\n\n`;
    
    // Lista de productos
    cart.forEach((item, index) => {
      const itemTotal = (item.quantity * item.product.unitPrice).toFixed(2);
      message += `${index + 1}. ${item.product.emoji} *${item.product.name}*\n`;
      message += `   Cantidad: ${item.quantity} ${item.product.unit}\n`;
      message += `   Precio: $${item.product.unitPrice}/${item.product.unit}\n`;
      message += `   Subtotal: $${itemTotal}\n\n`;
    });
    
    // Resumen de costos
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.product.unitPrice), 0);
    message += `📋 *RESUMEN:*\n`;
    message += `Subtotal: $${subtotal.toFixed(2)}\n`;
    
    if (deliveryCost > 0) {
      message += `Envío: $${parseFloat(deliveryCost).toFixed(2)}\n`;
    }
    
    message += `*Total: $${total.toFixed(2)}*\n\n`;
    
    // Información de entrega
    if (address) {
      message += `📍 *Dirección de entrega:*\n${address}\n\n`;
    }
    
    if (phone) {
      message += `📞 *Teléfono de contacto:* ${phone}\n\n`;
    }
    
    message += `¡Gracias por tu compra! 🛒✨\n`;
    message += `Te contactaremos pronto para coordinar la entrega.`;
    
    return message;
  };

  const handleCopy = async () => {
    const message = generateMessage();
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleWhatsAppSend = () => {
    const message = generateMessage();
    
    // Usar encodeURI en lugar de encodeURIComponent para preservar mejor los emojis
    // y caracteres especiales Unicode
    const encodedMessage = encodeURI(message).replace(/#/g, '%23');
    const phone = details?.phone?.replace(/\D/g, '') || '';
    
    let whatsappUrl;
    if (phone) {
      whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    } else {
      whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    }
    
    window.open(whatsappUrl, '_blank');
  };

  const message = generateMessage();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={<><MessageCircle size={20} className="inline mr-2" />Mensaje de WhatsApp</>}
    >
      <div className="p-4 space-y-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono">
            {message}
          </pre>
        </div>
        
        <div className="flex gap-3 justify-around ">
          <button
            onClick={handleCopy}
            className="btn-secondary flex-1 flex gap-3 items-center"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "¡Copiado!" : "Copiar Mensaje"}
          </button>
          <button
            onClick={handleWhatsAppSend}
            className="btn-primary flex-1 gap-3 flex items-center"
          >
            <MessageCircle size={18} />
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WhatsAppMessage;