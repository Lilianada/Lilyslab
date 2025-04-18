// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { motion } from "framer-motion"
// import { Lock } from "lucide-react"
// import { useAuth } from "@/contexts/auth-context"
// import { useToast } from "@/hooks/use-toast"
// import logoImage from '@/public/logo.png';
// import { useRouter } from "next/navigation"

// export default function WelcomePage() {
//   const { signInWithGoogle: signIn, user } = useAuth()
//   const { toast } = useToast()
//   const [isSigningIn, setIsSigningIn] = useState(false)
//   const router = useRouter()

//   // Handle authenticated users by redirecting to dashboard
//   useEffect(() => {
//     if (user) {
//       window.location.href = "/dashboard"
//     }
//   }, [user])
  
//   // Don't render anything while redirecting
//   if (user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//       </div>
//     );
//   }
  
//   const handleSignIn = async () => {
//     setIsSigningIn(true)
//     try {
//       const user = await signIn()
//       if (user) {
//         toast({
//           title: "Welcome back!",
//           description: "You have successfully signed in.",
//           duration: 3000,
//         })
//         // Explicitly navigate to dashboard after successful sign-in
//         window.location.href = "/dashboard"
//       } else {
//         throw new Error("Sign in failed")
//       }
//     } catch (error) {
//       console.error("Error signing in:", error)
//       toast({
//         title: "Sign in failed",
//         description: "There was a problem signing you in. Please try again.",
//         variant: "destructive",
//         duration: 3000,
//       })
//     } finally {
//       setIsSigningIn(false)
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen px-4 py-16 bg-background">
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{
//           type: "spring",
//           stiffness: 100,
//           damping: 20,
//           delay: 0.2
//         }}
//         className="max-w-xl mx-auto text-center space-y-12"
//       >
//         {/* Logo - Fixed with priority and unoptimized for local development */}
//         <div className=" mx-auto h-56 w-56">
//           <Image
//             src={logoImage}
//             alt="Lily's Lab Logo"
//             width={348}
//             height={348}
//             priority
//             className="object-contain w-full h-full bg-primary rounded-full"
//           />
//         </div>

//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           <div className="space-y-4 ">
//             <p className="text-base sm:text-lg leading-normal text-muted-foreground">
//               Hi, I'm Lilian, a software engineer, technical product developer and perpetual learner. 
//               👋 Follow along as I share my work and study notes, as well as good product ideas I pick up along the way.
//             </p>

//             <p className="font-semibold text-sm sm:text-base">
//               By Lilian Ada · Over 500 subscribed members.
//             </p>

//             <Button 
//               size="lg"
//               variant="outline"
//               onClick={handleSignIn}
//               className="bg-card text-foreground hover:bg-foreground/10 rounded-lg w-48"
//               disabled={isSigningIn}
//             >
//               {isSigningIn ? (
//                 <>
//                   <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign in with Google"
//               )}
//             </Button>
//           </div>

//           <div className="space-y-1 mt-8">
//             <div className="flex items-center justify-center flex-col gap-1">
//               <Lock className="w-5 h-5" />
//               <span className="font-medium text-sm">This site is private</span>
//             </div>
//             <p className="text-muted-foreground text-sm">
//               By signing up, you agree to become a subscribed member.
//             </p>
//           </div>
//         </motion.div>

//       </motion.div>
//     </div>
//   )
// }
