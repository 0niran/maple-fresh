import { useState, useEffect, useMemo } from 'react';
import { QuoteBreakdown } from '@/types';
import { QuoteFormData } from '@/types/forms';
import { QuoteCalculator } from '@/services/quote-calculator';

export function useQuote(formData: Partial<QuoteFormData>) {
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);

  // Create a stable string representation for deep comparison
  const formDataKey = useMemo(() => {
    return JSON.stringify({
      services: formData.services || [],
      propertyType: formData.propertyType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      squareFootage: formData.squareFootage,
    });
  }, [formData.services, formData.propertyType, formData.bedrooms, formData.bathrooms, formData.squareFootage]);

  const isValidForQuote = useMemo(() => {
    return (
      formData.services?.length &&
      formData.services.length > 0 &&
      formData.propertyType &&
      typeof formData.bedrooms === 'number' &&
      typeof formData.bathrooms === 'number' &&
      typeof formData.squareFootage === 'number'
    );
  }, [formDataKey]);

  useEffect(() => {
    if (isValidForQuote) {
      try {
        const calculatedQuote = QuoteCalculator.calculate(formData as QuoteFormData);
        setQuote(calculatedQuote);
      } catch (error) {
        console.error('Error calculating quote:', error);
        setQuote(null);
      }
    } else {
      setQuote(null);
    }
  }, [formDataKey, isValidForQuote, formData]);

  return {
    quote,
    isValidForQuote,
  };
}