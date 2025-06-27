import React, { JSX } from "react";
import { cn } from "../../../lib/utils";

const createCardComponent = <T extends keyof JSX.IntrinsicElements>(
  Component: T,
  defaultClassName: string,
  displayName: string
) => {
  type Props = React.ComponentPropsWithoutRef<T> & { className?: string };
  const CardComponent = React.forwardRef<HTMLElement, Props>(
    ({ className, ...props }, ref) =>
      React.createElement(
        Component,
        {
          ref,
          className: cn(defaultClassName, className),
          ...props,
        }
      )
  );
  CardComponent.displayName = displayName;
  return CardComponent as unknown as React.FC<Props & React.RefAttributes<HTMLElement>>;
};

const Card = createCardComponent("div", "rounded-lg bg-card text-card-foreground shadow-sm", "Card");
const CardHeader = createCardComponent("div", "flex flex-col space-y-1.5 p-6", "CardHeader");
const CardTitle = createCardComponent("h3", "text-2xl font-semibold leading-none tracking-tight", "CardTitle");
const CardDescription = createCardComponent("p", "text-sm text-muted-foreground", "CardDescription");
const CardContent = createCardComponent("div", "p-6 pt-0", "CardContent");
const CardFooter = createCardComponent("div", "flex items-center p-6 pt-0", "CardFooter");

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
