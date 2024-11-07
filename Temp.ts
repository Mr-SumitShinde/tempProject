import { useEffect, useRef } from 'react';

function MyComponent(props) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else {
      console.log("Effect runs only on updates, not on the first render");
    }
  }, [props.value]);
}