"use client";

import React from "react";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
      <Separator className="flex-1" />
      <Badge variant="secondary" className="mx-4 text-xs font-normal">
        {formatDate(date)}
      </Badge>
      <Separator className="flex-1" />
    </div>
  );
};

export default DateDivider;
