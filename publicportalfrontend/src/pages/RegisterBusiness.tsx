import React, { useState } from "react";
import bg from "../assets/bg1.png";
import logo from "../assets/lg.png";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { renderError } from "../helper/ErrorHelper";
import { validateField } from "../helper/ValidationHelper";
import { addBusinessDetailsService } from "../services/BusinessDetails";
import { b } from "framer-motion/dist/types.d-BJcRxCew";

const { Text } = Typography;

interface Business {
  businessName: string;
  ownerName: string;
  phoneNumber: string;
}

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<Business>({
    businessName: "",
    ownerName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<any>({});
  const userID = Number(localStorage.getItem("userID"));
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        userID: userID,
        business: {
          businessName: values.businessName,
          ownerName: values.ownerName,
          phoneNumber: values.phoneNumber,
        },
      };
      const response = await addBusinessDetailsService(data);

      if (response.message === "success") {
        toast.success("Business details added successfully.");
        setTimeout(() => navigate("/add-genres"), 2000);
      } else {
        toast.error(response.error || "Registration failed. Try again!");
      }
      console.log("response:", response);
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    const error = validateField(name, value);
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: any = {};
    Object.entries(formValues).forEach(([key, value]) => {
      newErrors[key] = validateField(key, value);
    });
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) return;

    onFinish(formValues);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="justify-center items-center bg-white/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-11/12 max-w-md text-center">
        <img
          className="w-32 h-16 object-contain mx-auto mb-2 cursor-pointer"
          onClick={() => navigate("/")}
          src={logo}
          alt="Logo"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
          Register Your Business
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="text-left">
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formValues.businessName}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${
                errors.businessName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-blue-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 w-full`}
            />
            {renderError(errors.businessName)}
          </div>

          <div className="text-left">
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={formValues.ownerName}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${
                errors.ownerName
                  ? "border-red-400 focus:ring-red-500"
                  : "border-blue-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 w-full`}
            />
            {renderError(errors.ownerName)}
          </div>

          <div className="text-left">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formValues.phoneNumber}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${
                errors.phoneNumber
                  ? "border-red-400 focus:ring-red-500"
                  : "border-blue-300 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 w-full`}
            />
            {renderError(errors.phoneNumber)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } w-full text-white font-semibold py-3 rounded-lg transition-all mt-2`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterBusiness;
