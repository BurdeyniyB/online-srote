import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Dropdown } from "react-bootstrap";
import { updateDevice, fetchBrands, fetchTypes } from "../../http/deviceAPI";

const EditDevice = ({ device, onHide }) => {
  const [name, setName] = useState(device.name || "");
  const [description, setDescription] = useState(device.description || "");
  const [price, setPrice] = useState(device.price || 0);
  const [sale, setSale] = useState(device.sale || 0);
  const [inStock, setInStock] = useState(device.inStock ?? true);
  const [file, setFile] = useState(null);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({ id: device.brandId, name: "" });
  const [selectedType, setSelectedType] = useState({ id: device.typeId, name: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrands().then((data) => {
      setBrands(data);
      const found = data.find((b) => b.id === device.brandId);
      if (found) setSelectedBrand(found);
    });
    fetchTypes().then((data) => {
      setTypes(data);
      const found = data.find((t) => t.id === device.typeId);
      if (found) setSelectedType(found);
    });
  }, [device.brandId, device.typeId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price));
      formData.append("sale", String(sale));
      formData.append("inStock", String(inStock));
      if (selectedBrand.id) formData.append("brandId", String(selectedBrand.id));
      if (selectedType.id) formData.append("typeId", String(selectedType.id));
      if (file) formData.append("img", file);
      await updateDevice(device.id, formData);
      onHide();
    } catch (e) {
      console.error("Failed to update device:", e);
    } finally {
      setSaving(false);
    }
  };

  const labelStyle = { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "#888", marginBottom: 3 };
  const currentImg = Array.isArray(device.img) ? device.img[0] : device.img;

  return (
    <Modal show onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Device <span style={{ color: "#ffa500" }}>#{device.id}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label style={labelStyle}>Type</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  {selectedType.name || "Choose type"}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: 200, overflowY: "auto" }}>
                  {types.map((t) => (
                    <Dropdown.Item key={t.id} onClick={() => setSelectedType(t)}>
                      {t.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={6}>
              <Form.Label style={labelStyle}>Brand</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  {selectedBrand.name || "Choose brand"}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: 200, overflowY: "auto" }}>
                  {brands.map((b) => (
                    <Dropdown.Item key={b.id} onClick={() => setSelectedBrand(b)}>
                      {b.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label style={labelStyle}>Name</Form.Label>
            <Form.Control
              placeholder="Device name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={labelStyle}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label style={labelStyle}>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0.00"
                  value={price}
                  min={0}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label style={labelStyle}>Sale (%)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={sale}
                  min={0}
                  max={100}
                  onChange={(e) => setSale(Number(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Check
            type="checkbox"
            label="In Stock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="mb-3"
          />

          <Form.Group>
            <Form.Label style={labelStyle}>Image</Form.Label>
            <div className="d-flex align-items-center gap-3">
              {currentImg && (
                <img
                  src={currentImg}
                  alt="current"
                  style={{ width: 64, height: 64, objectFit: "contain", border: "1px solid #eee", borderRadius: 8, flexShrink: 0 }}
                />
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="outline-success" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDevice;
