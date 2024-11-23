import { useEffect } from "react";
import { useShape } from "@/store/ShapeShifter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MorphingAnimation = () => {
  const { shape, toBoxShape, toSphereShape }: any = useShape();

  useEffect(() => {
   

    // Create multiple timelines
    const firstMoveTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrollingTest",
        // markers: true,
        start: "top bottom",
        end: "bottom bottom",
        toggleActions: "restart none none reverse",
      },
      onStart: () => {
        toBoxShape(); 
      },
      onReverseComplete: () => {
        toSphereShape();
      },
    });

    firstMoveTimeline
      .to(shape, {
        duration: 0.1,
        ease: "power3.inOut",
      })
      .add(() => {
        
      });


    const secondMoveTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrollingTest2",
        // markers: true,
        start: "top bottom",
        end: "bottom bottom",
        toggleActions: "restart none none reverse",
      },
      onStart: () => {
        toSphereShape(); 
      },
      onReverseComplete: () => {
        toBoxShape();
      },
    });

    secondMoveTimeline
      .to(shape, {
        duration: 0.1,
        ease: "power3.inOut",
      })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Cleanup on unmount
    };
  }, [shape , toBoxShape,toSphereShape]); // dependency array ensures that the effect re-runs when 'shape' changes

  return null; // or return a JSX element if needed
};

export default MorphingAnimation;
