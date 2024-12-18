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
  const [orderNote, setOrderNote] = useState("");

  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem('cart'); 
    }
  };

  const handleAddToCart = (item, ordered_quantity = 1) => {
    setCartItems((prevState) => {
      const isItemInCart = prevState.find(
        (cartItem) => cartItem.id === item.id
      );

      let updatedCartItems;

      if (isItemInCart) {
        updatedCartItems = prevState.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                ordered_quantity: Math.min(
                  cartItem.ordered_quantity + ordered_quantity,
                  item.totalQuantity
                ),
              }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevState,
          {
            ...item,
            ordered_quantity: Math.min(ordered_quantity, item.totalQuantity),
          },
        ];
      }

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
            if (cartItem.ordered_quantity === 1) {
              return null;
            } else {
              return {
                ...cartItem,
                ordered_quantity: cartItem.ordered_quantity - 1,
              };
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
        orderNote,
        setOrderNote,
        handleAddToCart,
        handleRemoveFromCart,
        handleDeleteFromCart,
        handleInputChange,
        clearCart
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default GlobalState;
