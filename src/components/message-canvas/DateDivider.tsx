"use client";

import React from "react";
import moment from "moment";
import { Separator } from "@/components/ui/separator";

interface DateDividerProps {
  date: string;
}

const DateDivider: React.FC<DateDividerProps> = ({ date }) => {
  const formatDate = (dateString: string) => {
    const messageDate = moment(dateString);
    return messageDate.calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'dddd',
      sameElse: 'MMMM D, YYYY'
    });
  };

  return (
    <div className="flex items-center justify-center my-4">
      <Separator className="flex-1 bg-border/50" />
      <div className="mx-4 text-xs font-normal text-foreground/30">
        {formatDate(date)}
      </div>
      <Separator className="flex-1 bg-border/50" />
    </div>
  );
};

export default DateDivider;
