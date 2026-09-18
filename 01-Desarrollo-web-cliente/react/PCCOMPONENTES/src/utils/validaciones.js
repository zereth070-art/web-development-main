       //REGEX PARA EL EMAIL

export const validateEmail = (email) => {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(String(email).toLowerCase());
     }