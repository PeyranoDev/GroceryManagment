import { useState, useEffect } from "react";
import { Copy, MessageCircle, Check } from "lucide-react";
import Modal from "../ui/modal/Modal";

const WhatsAppMessage = ({ 
  saleId,
  cart,
  details,
  total,
  deliveryCost,
  isOpen,
  onClose,
  generateWhatsAppMessage
}) => {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && saleId && generateWhatsAppMessage) {
      const fetchMessage = async () => {
        setLoading(true);
        try {
          const response = await generateWhatsAppMessage(saleId, details);
          setMessage(response.message || generateFallbackMessage());
        } catch (error) {
          console.error('Error generating WhatsApp message:', error);
          setMessage(generateFallbackMessage());
        } finally {
          setLoading(false);
        }
      };
      
      fetchMessage();
    } else if (isOpen) {
      setMessage(generateFallbackMessage());
    }
  }, [isOpen, saleId, details, generateWhatsAppMessage]);

  const generateFallbackMessage = () => {
    if (!details || cart.length === 0) return "";

    const customerName = details.client || "Cliente";
    
    let message = `🛒 *Tomillo Verdulería*\n\n`;
    message += `📅 Fecha: ${new Date(details.date).toLocaleDateString('es-AR')}\n`;
    message += `🕐 Hora: ${details.time}\n`;
    
    if (customerName) {
      message += `👤 Cliente: ${customerName}\n`;
    }
    
    message += `� Método de pago: ${details.paymentMethod}\n`;
    
    if (details.isOnline) {
      message += `🚚 Venta Online - Costo de envío: $${deliveryCost.toFixed(0)}\n`;
    }
    
    message += `\n📋 *Detalle de productos:*\n`;
    
    cart.forEach((item) => {
      const itemPrice = item.promotionApplied && item.product.promotion 
        ? calculatePromotionPrice(item) 
        : item.quantity * item.product.unitPrice;
      
      message += `• ${item.product.name} x${item.quantity} - $${itemPrice.toFixed(0)}\n`;
    });
    
    const subtotal = cart.reduce((sum, item) => {
      if (item.promotionApplied && item.product.promotion) {
        return sum + calculatePromotionPrice(item);
      }
      return sum + (item.quantity * item.product.unitPrice);
    }, 0);
    
    message += `\n💰 *Subtotal:* $${subtotal.toFixed(0)}\n`;
    
    if (details.isOnline && deliveryCost > 0) {
      message += `🚚 *Envío:* $${deliveryCost.toFixed(0)}\n`;
      message += `💰 *Total:* $${(subtotal + deliveryCost).toFixed(0)}\n`;
    } else {
      message += `� *Total:* $${subtotal.toFixed(0)}\n`;
    }
    
    if (details.observations) {
      message += `\n� *Observaciones:* ${details.observations}`;
    }
    
    message += `\n\n¡Gracias por tu compra! �`;
    
    return message;
  };

  const calculatePromotionPrice = (item) => {
    if (item.product.promotion?.quantity > 0 && item.product.promotion?.price > 0) {
      const promoQuantity = item.product.promotion.quantity;
      const promoPrice = item.product.promotion.price;
      
      const promoSets = Math.floor(item.quantity / promoQuantity);
      const remainingQty = item.quantity % promoQuantity;
      
      return (promoSets * promoPrice) + (remainingQty * item.product.unitPrice);
    }
    
    return item.quantity * item.product.unitPrice;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      const textArea = document.createElement('textarea');
      textArea.value = message;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppSend = () => {
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

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={<><MessageCircle size={20} className="inline mr-2" />Mensaje de WhatsApp</>}
    >
      <div className="p-4 space-y-4">
        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Generando mensaje...
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono">
              {message}
            </pre>
          )}
        </div>
        
        <div className="flex gap-3 justify-around">
          <button
            onClick={handleCopy}
            disabled={loading || !message}
            className="btn-secondary flex-1 flex gap-3 items-center disabled:opacity-50"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "¡Copiado!" : "Copiar Mensaje"}
          </button>
          <button
            onClick={handleWhatsAppSend}
            disabled={loading || !message}
            className="btn-primary flex-1 gap-3 flex items-center disabled:opacity-50"
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