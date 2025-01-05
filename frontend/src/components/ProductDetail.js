import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // Pobieramy ID produktu z URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getProductDetails/${id}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać szczegółów produktu');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return <p>Ładowanie szczegółów produktu...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price} PLN</p>
      {/* Możesz dodać więcej szczegółów produktu tutaj */}
    </div>
  );
};

export default ProductDetail;
