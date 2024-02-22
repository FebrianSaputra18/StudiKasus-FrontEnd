import { useEffect, useState } from "react";
import Select from "react-select";
import { Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAddressPage = () => {
  // const [validated, setValidated] = useState(false);

  const [dataProvinces, setDataProvinces] = useState([]);
  const [dataRegencies, setDataRegencies] = useState([]);
  const [dataDistricts, setDataDistricts] = useState([]);
  const [dataVillages, setDataVillages] = useState([]);
  // const [dataDetails, setDataDetails] = useState([]);

  const [name, setName] = useState("");
  const [provincesSelect, setProvincesSelect] = useState("");
  const [regenciesSelect, setRegenciesSelect] = useState("");
  const [districtsSelect, setDistrictsSelect] = useState("");
  const [villagesSelect, setVillagesSelect] = useState("");
  const [detailsSelect, setDetailsSelect] = useState("");
  const token = localStorage.getItem("authToken");

  const history = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedProvince = dataProvinces.find(
      (province) => province.value === provincesSelect
    );
    const selectedRegencie = dataRegencies.find(
      (regencie) => regencie.value === regenciesSelect
    );
    const selectedDistrict = dataDistricts.find(
      (district) => district.value === districtsSelect
    );
    const selectedVillage = dataVillages.find(
      (village) => village.value === villagesSelect
    );

    const submitAddress = {
      nama: name,
      provinsi: selectedProvince.label,
      kabupaten: selectedRegencie.label,
      kecamatan: selectedDistrict.label,
      kelurahan: selectedVillage.label,
      detail: detailsSelect,
    };

    console.log(submitAddress, "submitAddress Done!");

    try {
      await axios
        .post("http://localhost:3000/api/delivery-addresses", submitAddress, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Address added : ", response.data);
          // setAllData({
          //   nama: "",
          //   provinsi: "",
          //   kabupaten: "",
          //   kecamatan: "",
          //   kelurahan: "",
          //   detail: "",
          // });
        });

      history("/hello/address");
    } catch (error) {
      console.error(error, " errrrrr bang");
    }

    console.log("ini select coba");
  };

  const getProvinces = async () => {
    const addressProvinces = await fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`
    );
    console.log("RESPONSE PROVINSI", addressProvinces);
    const provinces = await addressProvinces.json();
    const result = provinces.map((data) => {
      return {
        label: data.name,
        value: data.id,
      };
    });
    console.log("Provinsi", result);
    setDataProvinces(result.sort((a, b) => a.label.localeCompare(b.label)));
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    const getRegencies = async () => {
      const addressRegencies = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provincesSelect}.json`
      );
      console.log("RESPONSE KOTA", addressRegencies);
      const regencies = await addressRegencies.json();
      const result = regencies.map((data) => {
        return {
          label: data.name,
          value: data.id,
        };
      });
      console.log("Kota", result);
      setDataRegencies(result.sort((a, b) => a.label.localeCompare(b.label)));
    };
    if (provincesSelect > 0) {
      getRegencies();
    }
  }, [provincesSelect]);
  useEffect(() => {
    const getDistricts = async () => {
      const addressDistricts = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regenciesSelect}.json`
      );
      console.log("RESPONSE KECAMATAN", addressDistricts);
      const districts = await addressDistricts.json();
      const result = districts.map((data) => {
        return {
          label: data.name,
          value: data.id,
        };
      });
      console.log("Kecamatan", result);
      setDataDistricts(result.sort((a, b) => a.label.localeCompare(b.label)));
    };
    if (regenciesSelect > 0) {
      getDistricts();
    }
  }, [regenciesSelect]);
  useEffect(() => {
    const getVillages = async () => {
      const addressVillages = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtsSelect}.json`
      );
      console.log("RESPONSE KELURAHAN", addressVillages);
      const villages = await addressVillages.json();
      const result = villages.map((data) => {
        return {
          label: data.name,
          value: data.id,
        };
      });
      console.log("Kelurahan", result);
      setDataVillages(result.sort((a, b) => a.label.localeCompare(b.label)));
    };
    if (districtsSelect > 0) {
      getVillages();
    }
  }, [districtsSelect]);

  return (
    <div className="homepage">
      <header className="w-100 min-vh-100 pt-5">
        <Container>
          <Row className="header-box pt-5">
            <Col lg="12">
              <h3 className="mb-4 text-center">
                Create! your address!!! <span> ..</span>
              </h3>
            </Col>
            <Form
              noValidate
              // validated={validated}
              onSubmit={handleSubmit}
              className="d-flex"
            >
              <Col lg="12" sm="12" className="pt-lg-0 pt-5">
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Name
                  </Form.Label>
                  <Col sm={10} lg="5">
                    <Form.Control
                      type="text"
                      value={name}
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name .."
                    />
                  </Col>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Provinsi
                  </Form.Label>
                  <Col sm={10} lg="5">
                    <Select
                      options={dataProvinces}
                      autoFocus
                      placeholder="Select Provinsi ..."
                      onChange={(e) => setProvincesSelect(e.value)}
                    ></Select>
                  </Col>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Provinces.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Kota
                  </Form.Label>
                  <Col sm={10} lg="5">
                    <Select
                      options={dataRegencies}
                      placeholder="Select Kota ..."
                      onChange={(e) => setRegenciesSelect(e.value)}
                    ></Select>
                  </Col>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Regencies.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Kecamatan
                  </Form.Label>
                  <Col sm={10} lg="5">
                    <Select
                      options={dataDistricts}
                      placeholder="Select Kecamatan ..."
                      onChange={(e) => setDistrictsSelect(e.value)}
                    ></Select>
                  </Col>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Districts.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Kelurahan
                  </Form.Label>
                  <Col sm={10} lg="5">
                    <Select
                      options={dataVillages}
                      placeholder="Select Kelurahan ..."
                      onChange={(e) => setVillagesSelect(e.value)}
                    ></Select>
                  </Col>
                  <Form.Control.Feedback type="invalid">
                    Please choose a Villages.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formHorizontalEmail"
                >
                  <Form.Label column sm={2}>
                    Detail
                  </Form.Label>
                  <Col sm={10} lg="5">
                    <Form.Control
                      onChange={(e) => setDetailsSelect(e.target.value)}
                      value={detailsSelect}
                      name="detail"
                      type="text"
                      as="textarea"
                      required
                      placeholder="Jl. Detail .."
                    />
                  </Col>

                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    required
                    id="done"
                    label="Agree to terms and conditions"
                    feedback="You must agree before submitting."
                    feedbackType="invalid"
                  />
                </Form.Group>
                <button
                  type="submit"
                  className="btn btn-sm btn-danger btn-lg rounded-1 me-2"
                >
                  Created!
                </button>
              </Col>
            </Form>
          </Row>
        </Container>
      </header>
    </div>
  );
};

export default AddAddressPage;
