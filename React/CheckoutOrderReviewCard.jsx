import React from "react";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import "./Checkout.css";

const _logger = logger.extend("checkout");

const CheckoutOrderReviewCard = props => {
  _logger(props.item);

  const defaultImage = e => {
    e.target.src = "img/dummy.png";
  };
  return (
    <tbody>
      <tr>
        <td className="order-pic thumb64">
          <img
            src={props.item.product.primaryImage}
            width="64"
            height="64"
            alt="dummy"
            onError={defaultImage}
          />
        </td>
        <td className="order-item-name">
          {props.item.product.manufacturer} {props.item.product.name}
        </td>
        <td className="order-qty">{props.item.quantity}</td>
        <td className="order-price">{props.item.inventory.basePrice}</td>
        <td className="order-tax">
          $
          {parseFloat(
            props.item.inventory.basePrice * 0.1 * props.item.quantity
          ).toFixed(2)}
        </td>
        <td className="order-total">
          $
          {parseFloat(
            props.item.inventory.basePrice * props.item.quantity * 1.1
          ).toFixed(2)}
        </td>
      </tr>
    </tbody>
  );
};

CheckoutOrderReviewCard.propTypes = {
  item: PropTypes.shape({
    product: PropTypes.shape({
      manufacturer: PropTypes.string,
      name: PropTypes.string,
      primaryImage: PropTypes.string
    }),
    quantity: PropTypes.number,
    inventory: PropTypes.shape({
      basePrice: PropTypes.number
    })
  })
};

export default CheckoutOrderReviewCard;
