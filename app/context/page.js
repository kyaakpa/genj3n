"use client";
import { createContext, useEffect, useState } from "react";

export const Context = createContext(null);

function GlobalState({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(window.localStorage.getItem("cartItems")) || [];
    } else {
      return [];
    }
  });

  const handleAddToCart = (item, quantity = 1) => {
    setCartItems((prevState) => {
      const isItemInCart = prevState.find(
        (cartItem) => cartItem.id === item.id
      );
      if (isItemInCart) {
        const updatedCartItems = prevState.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "cartItems",
            JSON.stringify(updatedCartItems)
          );
        }
        return updatedCartItems;
      }
      const updatedCartItems = [...prevState, { ...item, quantity }];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "cartItems",
          JSON.stringify(updatedCartItems)
        );
      }
      return updatedCartItems;
    });
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prevState) => {
      const updatedCartItems = prevState
        .map((cartItem) => {
          if (cartItem.id === id) {
            if (cartItem.quantity === 1) {
              return null;
            } else {
              return { ...cartItem, quantity: cartItem.quantity - 1 };
            }
          }
          return cartItem;
        })
        .filter(Boolean);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "cartItems",
          JSON.stringify(updatedCartItems)
        );
      }

      return updatedCartItems;
    });
  };

  const handleDeleteFromCart = (id) => {
    setCartItems((prevState) => {
      const updatedCartItems = prevState.filter(
        (cartItem) => cartItem.id !== id
      );

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "cartItems",
          JSON.stringify(updatedCartItems)
        );
      }

      return updatedCartItems;
    });
  };

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value > cartItems[index].totalQuantity) {
      setCartItems((prev) => {
        const newItems = [...prev];
        newItems[index].quantity = cartItems[index].totalQuantity;
        return newItems;
      });
    } else {
      setCartItems((prev) => {
        const newItems = [...prev];
        newItems[index].quantity = value;
        return newItems;
      });
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("cartItems");
        setCartItems([]);
      }
    }, 24 * 60 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Context.Provider
      value={{
        cartItems,
        handleAddToCart,
        handleRemoveFromCart,
        handleDeleteFromCart,
        handleInputChange,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default GlobalState;
