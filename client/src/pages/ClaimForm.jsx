import React, { useState } from "react";
import { TextInput, Button, Datepicker } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ClaimForm() {
  const { itemId } = useParams(); // Retrieve itemId from URL
  const [formData, setFormData] = useState({
    name: "",
    date: new Date(),
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = formData.date.toISOString(); // Ensure the date is in ISO string format

    const submissionData = {
      name: formData.name,
      date: formattedDate,
    };

    try {
      console.log("Submitting form...", submissionData, "for item ID:", itemId);
      const response = await fetch(`/api/items/claim/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          date: formData.date.toISOString(),
        }),
      });

      if (response.ok) {
        alert("Form Submitted Successfully!");
        navigate(`/item/${itemId}`); // Redirect back to the item details page
      } else {
        const errorData = await response.json(); // Parsing response to get error details
        throw new Error(errorData.message || "Failed to submit claim");
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Submission Failed!" + error.message);
    }
  };

  return (
    <div className="p-3 max-w-xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Claim Form</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Name"
          required
          name="name"
          className="w-full"
          onChange={handleChange}
        />
        <Datepicker
          selected={formData.date}
          onChange={handleDateChange}
          required
        />
        <Button type="submit" gradientDuoTone="cyanToBlue">
          Confirm
        </Button>
      </form>
    </div>
  );
}
