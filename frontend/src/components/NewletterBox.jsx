import React from 'react';

const NewletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text text-[#5c4b42]">
        Want to stay updated on our latest offers ? sign up to our Newsletter !
      </p>
      <form
        className="w-[90%] sm:w-2/3 md:w-1/2 flex items-center gap-3 mx-auto my-6 border rounded-lg pl-3"
        onSubmit={onSubmitHandler}
      >
        <input
          className="w-full sm:flex-1 outline-none "
          type="email"
          placeholder="Enter Your Email"
          required
        />
        <button
          className="px-8 py-3 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-tr-lg rounded-br-lg transition-colors duration-300"
          type="submit"
        >
          Notify Me!
        </button>
      </form>
    </div>
  );
};

export default NewletterBox;
