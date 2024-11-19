import { Input } from "antd";
import React, {useState} from "react";
import { WapperInputStyle } from "./style";

const InputForm = (props) => {
    const [valueInput, setvalueInput] = useState('')
    const {placeholder = 'Nhập text', ...rests} = props
    return (
        <WapperInputStyle placeholder = {placeholder} valueInput = {valueInput} {...rests} />
    )
}
export default InputForm