"use client";

import React from "react";
import { CalendarEvent } from "@/app/admin/types/calendarEvent.type";
import { ToolbarProps, View } from "react-big-calendar";
import { Button } from "@/components/Button";

const BigCalendarToolbar = ({
  date,
  label,
  localizer,
  onNavigate,
  onView,
  view,
  views,
  children,
}: ToolbarProps<CalendarEvent, object>) => {
  const availableViews: View[] = Object.values(views) as View[];

  const getViewTranslations = (viewName: View) => {
    if (viewName === "week") {
      return "Hét";
    }

    if (viewName === "day") {
      return "Nap";
    }

    if (viewName === "month") {
      return "Hónap";
    }

    return localizer.messages[viewName];
  };

  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center justify-strat">
        <Button size="sm" variant="ghost" onClick={() => onNavigate("PREV")}>
          Előző
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onNavigate("NEXT")}>
          Következő
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onNavigate("TODAY")}>
          Ma
        </Button>
      </div>
      <span>{label}</span>
      <div className="view-buttons">
        {availableViews.map((viewName) => (
          <Button
            key={viewName}
            size="sm"
            variant={view === viewName ? "default" : "ghost"}
            onClick={() => onView(viewName)}
            // TODO: Add active state
            className={view === viewName ? "active" : ""}
          >
            {getViewTranslations(viewName)}
          </Button>
        ))}
      </div>
      {children}
    </div>
  );
};

export default BigCalendarToolbar;
