import { mountedComponent, screen } from "test-utils";
import Link from "./component";

describe("<Link /> components/link-button/components", () => {
    const props = {
      icon: <></>,
      isTransparent: false,
      rest: {},
      text:"Test Link",
      id:"link"
    };  
    it("renders a <Link /> component", () => {
        const newProps = {
            ...props,
            className: "MuiLink-root"
          }; 
        mountedComponent(<Link {...newProps} />);        
        expect(screen.getByText("Test Link").closest('a')).toHaveClass('MuiLink-root');    
    });
});
