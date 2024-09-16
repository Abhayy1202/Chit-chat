import React from "react";

export const DetailsForm = ({
  userDetails,
  handleDetailsChange,
  handleDetailsSubmit,
  setShowDetailsForm,
  loading,
}) => (
  <div className="overlay">
    <div className="details-form bg-gray-900">
      <h2 className="font-mono">Provide Details for Quotation</h2>
      <form onSubmit={handleDetailsSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleDetailsChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleDetailsChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={userDetails.phone}
            onChange={handleDetailsChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={userDetails.address}
            onChange={handleDetailsChange}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowDetailsForm(false)}
          className="close-button font-mono"
        >
          Close
        </button>

        <span className="divider-h"></span>

        <button
          className="btn-submit font-mono ml-12 hover:animate-pulse"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  </div>
);
