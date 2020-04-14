import styled from 'styled-components';
import { Row, Col } from 'antd';

export const StyledCol = styled(Col)`
  border-bottom: 1px solid #e8e8e8;
  height: 55px;
  padding: 1%;
`;
export const StyledHeadCol = styled(Col)`
  padding: 16px 16px;
  background: #fafafa;
  -webkit-transition: background 0.3s ease;
  transition: background 0.3s ease;
  text-align: left;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  border-bottom: 1px solid #e8e8e8;
`;
export const StyledRow = styled(Row)`
  &:hover {
    background: #f1f8ff;
  }
`;
