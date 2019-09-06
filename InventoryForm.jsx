import React from "react";
import { Formik, FastField, Form } from "formik";
import * as inventoryService from "../../../services/inventoryService";
import inventoryValidationSchema from "./inventoryValidationSchema";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import Swal from "sweetalert";
import InventoryCard from "./InventoryCard";
import "./InventoryCardStyle.css";

const _logger = logger.extend("inventory");

class InventoryForm extends React.Component {
  constructor() {
    super();
    this.state = {
      formData: {
        productId: "",
        quantity: "",
        basePrice: ""
      },
      isEditing: false
    };
  }

  componentDidMount() {
    if (this.props.location.pathname.includes("create")) {
    } else {
      if (this.props.match.params.id) {
        if (this.props.location.state) {
          const inventory = this.props.location.state;
          this.setState(() => {
            return {
              formData: {
                productId: inventory.inventory.productId,
                quantity: inventory.inventory.quantity,
                basePrice: inventory.inventory.basePrice,
                primaryImage: inventory.inventory.primaryImage,
                manufacturer: inventory.inventory.manufacturer,
                name: inventory.inventory.name,
                year: inventory.inventory.year
              },
              isEditing: true
            };
          });
        } else {
          inventoryService
            .getById(this.props.match.params.id)
            .then(this.onGetByIdSuccess)
            .catch(this.onGetByIdError);
        }
      }
    }
  }

  onGetByIdSuccess = response => {
    this.setState(() => {
      return {
        formData: {
          productId: response.item.productId,
          quantity: response.item.quantity,
          basePrice: response.item.basePrice,
          primaryImage: response.item.primaryImage,
          manufacturer: response.item.manufacturer,
          name: response.item.name,
          year: response.item.year
        },
        isEditing: true
      };
    });
  };

  onGetByIdError = error => {
    _logger(error);
  };

  handleSubmit = values => {
    _logger(values, "VALUES");
    const payload = {
      productId: values.productId,
      quantity: values.quantity,
      basePrice: values.basePrice
    };
    if (this.state.isEditing) {
      payload.id = this.props.match.params.id;
      inventoryService
        .update(payload)
        .then(this.onSuccess)
        .catch(this.onError);
    } else {
      inventoryService
        .create(payload)
        .then(this.onSuccess)
        .catch(this.onError);
    }
  };

  handleCancel = () => {
    this.clearForm();
  };

  clearForm = () => {
    this.redirectToDisplay();
  };

  onSuccess = response => {
    _logger(response);
    this.redirectToDisplay(response);
    if (this.state.isEditing) {
      Swal("Success", "Inventory successfully updated!", "success");
    } else {
      Swal("Success", "New inventory successfully created!", "success");
    }
  };

  onError = errResponse => {
    _logger(errResponse);
    Swal("Error", "Unable to create new inventory!", "error");
  };

  redirectToDisplay = () => {
    if (this.props.currentUser.id) {
      this.props.history.push(
        `/admin/sellers/${this.props.currentUser.id}/inventory`
      );
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          {this.state.formData.productId ? (
            <InventoryCard
              item={this.state.formData}
              isEditing={this.state.isEditing}
            />
          ) : null}
          <Formik
            initialValues={this.state.formData}
            onSubmit={this.handleSubmit}
            validationSchema={inventoryValidationSchema}
            enableReinitialize={true}
            render={formikProps => (
              <div className="col-md-5">
                <div className="cardInventory">
                  <div className="card-body">
                    <Form>
                      <div
                        className={`${
                          this.state.isEditing
                            ? "disabled position-relative form-group"
                            : "position-relative form-group"
                        }`}
                      >
                        <label htmlFor="productId">Product ID</label>
                        <FastField
                          name="productId"
                          type="int"
                          placeholder="Enter Product ID"
                          component="input"
                          className="form-control"
                        />
                        {formikProps.touched.productId &&
                          formikProps.errors.productId && (
                            <div className="text-danger">
                              {formikProps.errors.productId}
                            </div>
                          )}
                      </div>
                      <div className="position-relative form-group">
                        <label htmlFor="Quantity">Quantity</label>
                        <FastField
                          name="quantity"
                          placeholder="Enter Quantity"
                          component="input"
                          className="form-control"
                        />
                        {formikProps.touched.quantity &&
                          formikProps.errors.quantity && (
                            <div className="text-danger">
                              {formikProps.errors.quantity}
                            </div>
                          )}
                      </div>
                      <div className="position-relative form-group">
                        <label htmlFor="basedPrice">Based Price</label>
                        <FastField
                          name="basePrice"
                          placeholder="Enter Based Price"
                          component="input"
                          className="form-control"
                        />
                        {formikProps.touched.basedPrice &&
                          formikProps.errors.basedPrice && (
                            <div className="text-danger">
                              {formikProps.errors.basedPrice}
                            </div>
                          )}
                      </div>
                      <div className="btn-group" role="group">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm float-left"
                        >
                          {this.state.isEditing ? "Update" : "Save"}
                        </button>
                      </div>
                      <div className="btn-group float-right" role="group">
                        <button
                          type="button"
                          onClick={this.handleCancel}
                          className="btn btn-warning btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

InventoryForm.propTypes = {
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  location: PropTypes.shape({
    state: PropTypes.shape(),
    pathname: PropTypes.string
  }),

  currentUser: PropTypes.shape({
    id: PropTypes.number
  })
};

export default InventoryForm;
