import React from "react";
import CheckoutOrderReviewCard from "./CheckoutOrderReviewCard";
import * as locationService from "../../services/locationService";
import CheckoutShipping from "./CheckoutShipping";
import AddressForm from "./AddressForm";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import * as checkoutService from "../../services/checkoutService";
import * as shippingService from "../../services/shippingService";
import swal from "sweetalert";

import StripePayment from "../stripe/StripePayment";
import { StripeProvider, Elements } from "react-stripe-elements";

const _logger = logger.extend("checkout");

class Checkout extends React.Component {
  state = {
    checkout: {
      billing: {
        locationTypeId: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        lineOne: "",
        lineTwo: "",
        city: "",
        stateId: "",
        zip: "",
        latitude: "",
        longitude: ""
      },
      shipping: {
        locationTypeId: "",
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        lineOne: "",
        lineTwo: "",
        city: "",
        stateId: "",
        zip: "",
        latitude: "",
        longitude: ""
      },
      order: {
        trackingCode: "",
        trackingUrl: ""
      },
      payment: {
        token: "",
        total: 0,
      }
    },
    checkoutReview: [],
    mappedcheckoutReview: [],
    currentPage: 0,
    pageSize: 10,
    subTotal: this.props.location.state.total,
    shippingAndHandling: 0,
    tax: 0,
    totalQuantity: 0,
    shippingItems: {
      "shipment": {
        "address_to":
        {
          "name": "Sample",
          "street1": "830 Traction Ave",
          "city": "Los Angeles",
          "state": "CA",
          "zip": "90013",
          "country": "US",
          "phone": "(1800)564-0350",
          "email": "team@re-cycle.com"

        },
        "address_from":
        {
          "name": "ReCycle",
          "street1": "12575 Beatrice St. B1",
          "city": "Los Angeles",
          "state": "CA",
          "zip": "90066",
          "country": "US",
          "phone": "(1800)564-0350",
          "email": "team@re-cycle.com"
        },
        "parcels": [{

          "mass_unit": "lb",
          "length": "45",
          "width": "10",
          "height": "32.5",
          "distance_unit": "in",
          "weight": "40"

        }],
        "rates": [{
          "amount": ""
        }],
        "servicelevel": {}
      },
      "carrier_account": "9dcdeec7e21b4c389ce995246de2d44e",
      "servicelevel_token": "usps_parcel_select"
    },

    isBilling: true,
    states: [],
    mappedState: []
  };

  componentDidMount() {
    this.getAll();
    this.getLocationState();
  }

  getAll = () => {
    let checkoutArray = this.props.location.state.shoppingCarts;
    _logger(checkoutArray, "===");
    this.setState(
      prevState => {
        return {
          ...prevState,
          checkoutReview: checkoutArray,
          mappedcheckoutReview: checkoutArray.map(this.mapCheckoutReview)
        };
      },
      () => this.getTotalQuantity()
    );
  };

  mapCheckoutReview = aCheckoutItem => (
    <CheckoutOrderReviewCard item={aCheckoutItem} key={aCheckoutItem.id} />
  );

  getLocationState = () => {
    locationService.getLocationState().then(response => {
      this.setState({
        mappedState: response.item.state.map(this.mapState),
        states: response.item.state
      });
    });
  };

  mapState = res => {
    return (
      <option key={res.id} value={res.id}>
        {res.stateProvinceCode}
      </option>
    );
  };

  getTotalQuantity = () => {
    let totalQuantityArray = this.props.location.state.shoppingCarts.map(
      obj => {
        return obj.quantity;
      }
    );
    let totalQuantity = totalQuantityArray.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue;
      }
    );
    this.setState(prevState => {
      return {
        ...prevState,
        totalQuantityArray: totalQuantityArray,
        totalQuantity: totalQuantity
      };
    });
  };

  getTotal = () => {
    this.setState(prevState => {
      return {
        ...prevState, checkout: {
          ...prevState.checkout, payment: {
            ...prevState.checkout.payment,
            total: (parseFloat(
              this.state.subTotal +
              (JSON.parse(this.state.shippingItems.shipment.rates[0].amount) * this.state.totalQuantity) +
              this.state.subTotal * .1
            ).toFixed(2) * 100)
          }
        }
      };
    }, () => _logger(this.state)
    );
  };

  handleSubmit = event => {
    event.preventDefault();
    this.onCheckOutSubmit()
      .then(this.onGetLabel)
      .then(this.onCheckoutSuccess)
      .catch(this.duringCheckoutError);
  };

  onCheckOutSubmit = () => {
    const prevShipState = { ...this.state.shippingItems };
    return shippingService
      .createLabel(prevShipState)
  };

  onGetLabel = response => {
    const shipInfo = response;
    this.setState(prevState => {
      return {
        ...prevState, checkout: {
          ...prevState.checkout, order: {
            ...prevState.checkout.order,
            trackingCode: shipInfo.tracking_number, trackingUrl: shipInfo.label_url
          }
        }
      }
    })
    return checkoutService.create(this.state.checkout)
  };

  onCheckoutSuccess = response => {
    _logger(response);
    swal({
      title: "Your order has been submitted",
      text: "Please hold tight as your order is prepared for shipping",
      buttons: {
        ok: {
          text: "Back to shop",
          value: "shop"
        },
        contact: {
          text: "My Orders",
          value: "orders"
        }
      }
    })
      .then(value => {
        switch (value) {
          case "shop":
            this.props.history.push("/shop");
            break;
          case "orders":
            this.props.history.push("/orders");
            break;
          default:
            return;
        }
      }
      )
    this.props.history.push("/");
  };

  onGetLabelError = error => {
    _logger("Create label was not successful", error)
  };

  handleBackToCart = () => {
    this.props.history.push("/shoppingcart");
  };

  handleCancelOrder = () => {
    checkoutService.cancel()
      .then(this.cancelOrderSuccess)
      .catch(this.cancelOrderError);
  };

  cancelOrderSuccess = response => {
    _logger(response);
    this.props.history.push("/shoppingcart");
  };

  duringCheckoutError = error => {
    _logger(error);
    swal({
      title: "Something has gone wrong",
      text: "Please contact support for further assistance",
      buttons: {
        ok: {
          text: "Ok",
          value: "ok"
        },
        contact: {
          text: "Contact Us",
          value: "contact"
        }
      }
    })
      .then(value => {
        switch (value) {
          case "ok":
            this.props.history.push("/shoppingcart");
            break;
          case "contact":
            this.props.history.push("/contact");
            break;
          default:
            return;
        }
      }
      )
  };


  token = tokenId => {
    const token = tokenId;
    this.setState(prevState => {
      return {
        ...prevState, checkout: {
          ...prevState.checkout, payment: {
            ...prevState.checkout.payment, token: token
          }
        }
      };
    });
  };

  fillAutoAddress = (addressData, isBilling) => {
    _logger(addressData, isBilling, "===========isBilling");
    let selectedState = this.state.states.filter(
      item => item.stateProvinceCode === addressData.state
    );
    addressData.state = selectedState[0].id;
    if (this.state.isBilling) {
      this.setState(() => {
        return {
          checkout: {
            billing: {
              locationTypeId: 2,
              firstName: addressData.firstName,
              lastName: addressData.lastName,
              emailAddress: addressData.emailAddress,
              phoneNumber: addressData.phoneNumber,
              lineOne: addressData.lineOne,
              lineTwo: addressData.lineTwo,
              city: addressData.city,
              stateId: addressData.stateId,
              zip: addressData.zip
            }
          }
        }
      });
    } else {
      this.setState(prevState => {
        return {
          ...prevState, checkout: {
            ...prevState.checkout,
            shipping: {
              locationTypeId: 4,
              firstName: addressData.firstName,
              lastName: addressData.lastName,
              emailAddress: addressData.emailAddress,
              phoneNumber: addressData.phoneNumber,
              lineOne: addressData.lineOne,
              lineTwo: addressData.lineTwo,
              city: addressData.city,
              state: addressData.stateId,
              zip: addressData.zip
            }
          }
        };
      });
    }
  };



  submitAddress = (formValues, isBilling) => {
    isBilling
      ? this.setState(prevState => {
        return {
          ...prevState, checkout: {
            ...prevState.checkout,
            billing: {
              locationTypeId: 2,
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              emailAddress: formValues.emailAddress,
              phoneNumber: formValues.phoneNumber,
              lineOne: formValues.lineOne,
              lineTwo: formValues.lineTwo,
              city: formValues.city,
              stateId: 9,
              zip: formValues.zip
            }
          }
        }
      })
      : this.setState(
        prevState => {
          return {
            ...prevState, checkout: {
              ...prevState.checkout, shipping: {
                locationTypeId: 4,
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                emailAddress: formValues.emailAddress,
                phoneNumber: formValues.phoneNumber,
                lineOne: formValues.lineOne,
                lineTwo: formValues.lineTwo,
                city: formValues.city,
                stateId: 9,
                zip: formValues.zip
              }
            },
            shippingItems: {
              ...prevState.shippingItems,
              shipment: {
                "address_to": {
                  name: formValues.firstName + " " + formValues.lastName,
                  street1: formValues.lineOne + " " + formValues.lineTwo,
                  city: formValues.city,
                  state: "CA",
                  zip: formValues.zip,
                  country: "US",
                  phone: formValues.phoneNumber,
                  email: formValues.emailAddress
                },
                "address_from": this.state.shippingItems.shipment.address_from,
                parcels: this.state.shippingItems.shipment.parcels,
                rates: [
                  {
                    amount: ""
                  }
                ]
              }
            }
          };
        },
        () => this.onShippingAddressSubmit()
      );
  };

  onShippingAddressSubmit = () => {
    const prevState = { ...this.state.shippingItems.shipment };
    shippingService
      .createShipment(prevState)
      .then(res => {
        this.setState(
          {
            shippingItems: {
              shipment: res,
              "carrier_account": "9dcdeec7e21b4c389ce995246de2d44e",
              "servicelevel_token": "usps_parcel_select"
            }
          },
          () => this.getTotal()
        );
      })
      .catch(_logger("Create shipment was not successful"));
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-3">
            <div className="b mb-2 card">
              <div className="bb card-header">
                <h4 className="card-title">Order Summary</h4>
              </div>
              <div className="bt card-body">
                <h4 className="b0">Order</h4>
              </div>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td>
                      <div className="text-right text-bold">
                        ${parseFloat(this.state.subTotal).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Estimated Tax</td>
                    <td>
                      <div className="text-right text-bold">
                        ${parseFloat(this.state.subTotal * 0.1).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>
                      <div className="text-right text-bold">${this.state.shippingItems.shipment.rates[0].amount === "" ? 0 : (this.state.shippingItems.shipment.rates[0].amount * this.state.totalQuantity)}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="card-body">
                <div className="clearfix">
                  <div className="float-right text-right">
                    <div className="text-bold">${this.state.checkout.payment.total === 0 ? parseFloat((this.state.subTotal + this.state.subTotal * .1)).toFixed(2) : (this.state.checkout.payment.total / 100)}</div>
                    <div className="text-sm">USD</div>
                  </div>
                  <div className="float-left text-bold text-dark">
                    ORDER TOTAL
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="container-md">
              <div className="accordion" id="accordion">
                <div className="card b mb-2">
                  <div id="biling" className="card-header">
                    <h4 className="card-title">
                      <a
                        data-toggle="collapse"
                        data-target="#collapseTwo"
                        aria-expanded="true"
                        aria-controls="collapseOne collapse03"
                        className="text-inherit"
                      >
                        1. Billing Information
                      </a>
                    </h4>
                  </div>
                  <div
                    id="collapseTwo"
                    className="collapse show"
                    aria-labelledby="billing"
                    data-parent="#accordion"
                  >
                    <AddressForm
                      submitAddress={this.submitAddress}
                      getLocationState={this.getLocationState}
                      fillAutoAddress={this.fillAutoAddress}
                      isBilling={true}
                      billing={this.state.checkout.billing}
                      mappedStates={this.state.mappedState}
                    />
                  </div>
                </div>

                <div className="card b mb-2">
                  <div
                    id="shippingInformation"
                    className="card-header"
                    data-toggle="collapse"
                    data-target="#collapse03"
                    aria-expanded="true"
                    aria-controls="collapse03"
                  >
                    <h4 className="card-title">
                      <a className="text-inherit">2. Shipping Information</a>
                    </h4>
                  </div>
                  <div
                    id="collapse03"
                    className="collapse"
                    aria-labelledby="shippingInformation"
                    data-parent="#accordion"
                  >
                    <AddressForm
                      submitAddress={this.submitAddress}
                      getLocationState={this.getLocationState}
                      fillAddress={this.fillAddress}
                      isBilling={false}
                      shipping={this.state.checkout.shipping}
                      mappedStates={this.state.mappedState}
                    />
                  </div>
                </div>

                <div className="card b mb-2">
                  <div
                    id="shippingMethod"
                    className="card-header"
                    data-toggle="collapse"
                    data-target="#collapse04"
                    aria-expanded="true"
                    aria-controls="collapse04"
                  >
                    <h4 className="card-title">
                      <a className="text-inherit">3. Shipping Method</a>
                    </h4>
                  </div>
                  <div
                    id="collapse04"
                    className="collapse"
                    aria-labelledby="shippingMethod"
                    data-parent="#accordion"
                  >
                    <CheckoutShipping
                      shippingRate={this.state.shippingItems.shipment.rates[0]}
                      quantity={this.state.totalQuantity}
                    ></CheckoutShipping>
                  </div>
                </div>

                <div className="card b mb-2">
                  <div
                    id="paymentInformation"
                    className="card-header"
                    data-toggle="collapse"
                    data-target="#collapse05"
                    aria-expanded="true"
                    aria-controls="collapse05"
                  >
                    <h4 className="card-title">
                      <a className="text-inherit">4. Payment Information</a>
                    </h4>
                  </div>

                  <div
                    id="collapse05"
                    className="collapse"
                    aria-labelledby="paymentInformation"
                    data-parent="#accordion"
                  >
                    <StripeProvider apiKey="pk_test_G4CvS8fxDWqHmTGm4bWQw4SZ00uFe3JWea">
                      <div className="justify-content-center example">
                        <Elements>
                          <StripePayment tokenId={this.token} />
                        </Elements>
                      </div>
                    </StripeProvider>
                  </div>
                </div>

                <div className="card b mb-2">
                  <div
                    id="orderReview"
                    className="card-header"
                    data-toggle="collapse"
                    data-target="#collapse06"
                    aria-expanded="true"
                    aria-controls="collapse06"
                  >
                    <h4 className="card-title">
                      <a className="text-inherit">5. Order Review </a>
                    </h4>
                  </div>

                  <div
                    id="collapse06"
                    className="collapse card-body"
                    aria-labelledby="orderReview"
                    data-parent="#accordion"
                  >
                    {" "}
                    <div className="table-responsive">
                      <table className="table">
                        <colgroup>
                          <col className="order-pic" span={1} />
                          <col className="order-item-name" span={1} />
                          <col className="order-qty" span={1} />
                          <col className="order-price" span={1} />
                          <col className="order-tax" span={1} />
                          <col className="order-total" span={1} />
                        </colgroup>
                        <thead className="bg-gray-lighter">
                          <tr>
                            <th>Product</th>
                            <th>Product Title</th>
                            <th className="wd-xs">Qty</th>
                            <th>Unit Price</th>
                            <th>Tax</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <td colSpan={5}>Subtotal</td>
                            <td>
                              ${parseFloat(this.state.subTotal).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}>Shipping &amp; Handling</td>
                            <td>${this.state.shippingItems.shipment.rates[0].amount === "" ? 0 : (this.state.shippingItems.shipment.rates[0].amount * this.state.totalQuantity)}</td>
                          </tr>
                          <tr>
                            <td colSpan={5}>Tax</td>
                            <td>
                              $
                              {parseFloat(this.state.subTotal * 0.1).toFixed(2)}
                            </td>
                          </tr>
                          <tr className="order-subtotal">
                            <td colSpan={5}>Total</td>
                            <td>${this.state.checkout.payment.total === 0 ? parseFloat((this.state.subTotal + this.state.subTotal * .1)).toFixed(2) : (this.state.checkout.payment.total / 100)}</td>
                          </tr>
                        </tfoot>
                        {this.state.mappedcheckoutReview}
                      </table>
                    </div>
                    <button
                      className="btn btn-default"
                      type="button"
                      onClick={this.handleSubmit}
                    >
                      Submit Order
                    </button>
                    <button
                      className="btn btn-warning"
                      type="button"
                      onClick={this.handleBackToCart}
                    >
                      Back to Cart
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={this.handleCancelOrder}
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Checkout.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      shoppingCarts: PropTypes.array,
      total: PropTypes.number
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  shippingRate: PropTypes.shape({
    amount: PropTypes.number
  })
};
export default Checkout;
