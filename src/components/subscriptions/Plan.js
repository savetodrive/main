/* eslint-disable react/no-array-index-key */
// source https://codepen.io/Creaticode/pen/pHEyJ
import React from 'react';
import { PropTypes } from 'prop-types';
import { Icon } from 'antd';
import startCase from 'lodash/fp/startCase';

// <Card title={startCase(plan.name)} bordered={false}>
// Description:
// <ul>{plan.description.map((description, index) => <li key={index}>{description}</li>)}</ul>
// <Button type="primary" onClick={onSelect(plan)}>
//  {selected && selected === plan._id && <Icon type="check" />}
//  Subscribe ({plan.price}$)
// </Button>
// </Card>
//   <li>
// 10 GB <span>De almacenamiento</span>
// </li>
// <li>
//   1 Dominio <span>incluido</span>
// </li>
// <li>
//   25 GB <span>De transferencia mensual</span>
// </li>
// <li>
//   Base de datos <span className="unlimited">ilimitadas</span>
// </li>
// <li>
//   Cuentas de correo <span className="unlimited">ilimitadas</span>
// </li>
// <li>
//   CPanel <span>incluido</span>
// </li>
const Plan = ({ plan, onSelect, selected = null }) => (
  <div className="pricing-table">
    <h3 className="pricing-title">{startCase(plan.name)}</h3>
    <div className="price">
      ${plan.price}
      <sup>/ month</sup>
    </div>
    <ul className="table-list">
      {plan.description.map((description, index) => (
        <li key={index}>
          <Icon type="check" color="#3fab91" />
          {description}
        </li>
      ))}
    </ul>
    <div className="table-buy">
      <button onClick={onSelect(plan)} className="pricing-action">
        {selected && selected === plan._id && <Icon type="check" />} Subscribe
      </button>
    </div>
  </div>
);

Plan.propTypes = {
  plan: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
};
export default Plan;
