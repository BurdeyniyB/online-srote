import React, { useContext, useRef, useState } from "react";
import { Context } from "..";
import { aiSearch } from "../http/deviceAPI";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const AiChat = () => {
  const { device } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) setTimeout(() => inputRef.current?.focus(), 100);
  };

  const applyFilters = (filters) => {
    device.setSearch(filters.search || "");
    device.setMinPrice(filters.minPrice ?? null);
    device.setMaxPrice(filters.maxPrice ?? null);
    if (filters.minRating != null) device.setMinRating(filters.minRating);
    if (filters.inStockOnly != null) device.setInStockOnly(filters.inStockOnly);
    if (filters.onSaleOnly != null) device.setOnSaleOnly(filters.onSaleOnly);

    if (filters.typeIds?.length) {
      const matched = device.types.filter((t) => filters.typeIds.includes(t.id));
      matched.forEach((t) => {
        if (!device.selectedType.find((s) => s.id === t.id)) {
          device.setSelectedType(t);
        }
      });
    }

    if (filters.brandIds?.length) {
      const matched = device.brands.filter((b) => filters.brandIds.includes(b.id));
      matched.forEach((b) => {
        if (!device.selectedBrand.find((s) => s.id === b.id)) {
          device.setSelectedBrand(b);
        }
      });
    }

    device.setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const filters = await aiSearch(text, device.types, device.brands);
      applyFilters(filters);
      setSummary(filters.summary || "Filters applied based on your request.");
      setInput("");
    } catch {
      setError("Could not process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    device.setSearch("");
    device.setMinPrice(null);
    device.setMaxPrice(null);
    device.setMinRating(null);
    device.setInStockOnly(false);
    device.setOnSaleOnly(false);
    device.selectedType.slice().forEach((t) => device.setSelectedType(t));
    device.selectedBrand.slice().forEach((b) => device.setSelectedBrand(b));
    device.setPage(1);
    setSummary("");
    setError("");
  };

  return (
    <div className="ai-chat-wrapper">
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <FaRobot className="ai-chat-header-icon" />
            <span>AI Assistant</span>
            <button className="ai-chat-close" onClick={handleToggle} aria-label="Close">
              <FaTimes />
            </button>
          </div>

          <div className="ai-chat-body">
            <p className="ai-chat-hint">
              Describe what you're looking for and I'll filter the catalog for you.
            </p>

            {summary && (
              <div className="ai-chat-summary">
                <span>{summary}</span>
                <button className="ai-chat-reset" onClick={handleReset}>
                  Clear filters
                </button>
              </div>
            )}

            {error && <div className="ai-chat-error">{error}</div>}
          </div>

          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="ai-chat-input"
              type="text"
              placeholder="e.g. cheap gaming laptop under $800"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              className="ai-chat-send"
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              {loading ? (
                <span className="ai-chat-spinner" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>
        </div>
      )}

      <button
        className={`ai-chat-fab ${open ? "active" : ""}`}
        onClick={handleToggle}
        aria-label="AI Assistant"
      >
        <FaRobot />
      </button>
    </div>
  );
};

export default AiChat;
