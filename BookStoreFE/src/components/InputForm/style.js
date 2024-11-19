import { Input } from "antd";
import styled from "styled-components";

export const WapperInputStyle = styled(Input)`
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    &:focus{
        background-color: rgb(232, 240,254)    
    }
`