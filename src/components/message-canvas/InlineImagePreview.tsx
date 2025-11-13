"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import { cn } from "@/lib/utils";
import { IconMaximize } from "@tabler/icons-react";
// import { Maximize2 } from "lucide-react";

interface InlineImagePreviewProps {
    imageUrl: string;
    isOwn?: boolean;
}

const InlineImagePreview: React.FC<InlineImagePreviewProps> = ({ imageUrl, isOwn = false }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setLightboxOpen(true)}
                className={cn(
                    "cursor-pointer rounded-xl overflow-hidden max-w-md md:max-w-lg relative group",
                    "border-2 transition-all duration-300",
                    isOwn
                        ? "border-primary/30 hover:border-primary/60 shadow-sm hover:shadow-md"
                        : "border-border/50 hover:border-border shadow-sm hover:shadow-md"
                )}
            >
                <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
                    <Image
                        src={imageUrl}
                        alt="Shared image"
                        width={512}
                        height={384}
                        className={cn(
                            "w-full h-auto object-contain transition-all duration-300 max-h-60",
                            "group-hover:scale-[1.02]"
                        )}
                    />
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "bg-linear-to-t from-background/80 via-transparent to-transparent"
                    )} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={cn(
                            "rounded-full p-3 opacity-0 group-hover:opacity-100",
                            "transition-all duration-300 transform scale-90 group-hover:scale-100",
                            "bg-background/40 backdrop-blur-md border border-border/50"
                        )}>
                            <IconMaximize className={cn("h-6 w-6 text-foreground")} />
                        </div>
                    </div>
                </div>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={[{
                    src: imageUrl,
                    download: imageUrl,
                    alt: "Image preview"
                }]}
                plugins={[Zoom, Download, Fullscreen]}
                zoom={{
                    maxZoomPixelRatio: 4,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    doubleClickDelay: 300,
                    doubleClickMaxStops: 3,
                    keyboardMoveDistance: 50,
                    wheelZoomDistanceFactor: 100,
                    pinchZoomDistanceFactor: 100,
                    scrollToZoom: true,
                }}
                styles={{
                    container: {
                        backgroundColor: "hsl(var(--background) / 0.98)",
                    },
                    toolbar: {
                        padding: "20px",
                        backgroundColor: "transparent",
                    },
                    button: {
                        filter: "none",
                    },
                }}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
                animation={{
                    fade: 400,
                    swipe: 300,
                    easing: {
                        fade: "ease-in-out",
                        swipe: "ease-out",
                    }
                }}
                controller={{
                    closeOnBackdropClick: true,
                    closeOnPullDown: true,
                    closeOnPullUp: false,
                }}
                carousel={{
                    finite: true,
                    preload: 1,
                }}
            />
        </>
    );
};

export default InlineImagePreview;
