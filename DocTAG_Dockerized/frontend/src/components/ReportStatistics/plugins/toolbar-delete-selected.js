import * as React from "react";
import {
    Template,
    TemplatePlaceholder,
    Plugin,
    TemplateConnector
} from "@devexpress/dx-react-core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";

const pluginDependencies = [
    { name: "Toolbar" },
    { name: "ToolbarFilterState" }
];

export class ToolbarFilter extends React.PureComponent {
    render() {
        return (
            <Plugin name="ToolbarFilter" dependencies={pluginDependencies}>
                <Template name="toolbarContent">
                    <TemplatePlaceholder />
                    <div>
                    CIAO
                    </div>
                    {/*<TemplateConnector>*/}
                    {/*    {(*/}
                    {/*        {*/}
                    {/*            toolbarFilterValue,*/}
                    {/*            toolbarFilterDataItems,*/}
                    {/*            toolbarFilterColumnTitle*/}
                    {/*        },*/}
                    {/*        { changeToolbarFilterValue, clearToolbarFilterValue }*/}
                    {/*    ) => (*/}
                    {/*        <div>*/}
                    {/*            <InputLabel htmlFor="filter-field">*/}
                    {/*                {toolbarFilterColumnTitle}:*/}
                    {/*            </InputLabel>*/}
                    {/*            <Select*/}
                    {/*                value={toolbarFilterValue}*/}
                    {/*                onChange={event => {*/}
                    {/*                    changeToolbarFilterValue(event.target.value);*/}
                    {/*                }}*/}
                    {/*                inputProps={{*/}
                    {/*                    name: "filter-field",*/}
                    {/*                    id: "filter-field"*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                {toolbarFilterDataItems.map((item, index) => (*/}
                    {/*                    <MenuItem key={index} value={item}>*/}
                    {/*                        {item}*/}
                    {/*                    </MenuItem>*/}
                    {/*                ))}*/}
                    {/*            </Select>*/}
                    {/*            <Button onClick={clearToolbarFilterValue}>Clear</Button>*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*</TemplateConnector>*/}
                </Template>
            </Plugin>
        );
    }
}
