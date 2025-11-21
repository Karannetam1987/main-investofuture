"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, LoaderCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const addressSchema = z.object({
  permanent: z.string().min(1, "Permanent address is required"),
  current: z.string().min(1, "Current address is required"),
});

const bankDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifsc: z.string().min(1, "IFSC code is required"),
  upi: z.string().optional(),
  bankAddress: z.string().min(1, "Bank address is required"),
});

const nomineeDetailsSchema = z.object({
  nomineeName: z.string().min(1, "Nominee name is required"),
  nomineeFatherName: z.string().min(1, "Father's name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  nomineeMobile: z.string().min(1, "Mobile number is required"),
  nomineeDob: z.date({ required_error: "Nominee's date of birth is required." }),
});

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  dob: z.date({ required_error: "Date of birth is required." }),
  gender: z.enum(["male", "female", "other"], {required_error: "Gender is required"}),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {required_error: "Marital status is required"}),
  religion: z.string().min(1, "Religion is required"),
  caste: z.string().min(1, "Caste is required"),
  children: z.string().optional(),
  bloodGroup: z.string().optional(),
  identificationMark: z.string().optional(),
  pan: z.string().min(1, "PAN number is required"),
  aadhaar: z.string().min(1, "Aadhaar number is required"),
});


const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
    personalInfo: personalInfoSchema,
    address: addressSchema,
    bankDetails: bankDetailsSchema,
    nomineeDetails: nomineeDetailsSchema,
    sameAsPermanent: z.boolean().default(false),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions.",
    }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      personalInfo: {
        fullName: "",
        fatherName: "",
        motherName: "",
        mobile: "",
        gender: undefined,
        maritalStatus: undefined,
        religion: "",
        caste: "",
        children: "0",
        bloodGroup: "",
        identificationMark: "",
        pan: "",
        aadhaar: "",
      },
      address: {
        permanent: "",
        current: "",
      },
      bankDetails: {
        bankName: "",
        accountNumber: "",
        ifsc: "",
        upi: "",
        bankAddress: "",
      },
      nomineeDetails: {
          nomineeName: "",
          nomineeFatherName: "",
          relationship: "",
          nomineeMobile: "",
      },
      sameAsPermanent: false,
      termsAccepted: false,
    },
  });

  const sameAsPermanent = form.watch("sameAsPermanent");
  const permanentAddress = form.watch("address.permanent");

  useEffect(() => {
    if (sameAsPermanent) {
      form.setValue('address.current', permanentAddress);
    }
  }, [sameAsPermanent, permanentAddress, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Registration Submitted",
      description: `Your registration data has been logged. In a real app, this would be sent to a server.`,
    });
    // Simulate a successful registration and redirect.
    setTimeout(() => {
        router.push("/dashboard");
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
           <div className="mb-6">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <Card className="max-w-4xl mx-auto card-within-page">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold font-headline text-secondary">Create an Account</CardTitle>
              <CardDescription>
                Enter your information to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                   <div className="space-y-4">
                     <h3 className="text-xl font-semibold text-secondary font-headline">Account Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.mobile" render={({ field }) => (<FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="123-456-7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     </div>
                   </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-secondary font-headline">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="personalInfo.fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.fatherName" render={({ field }) => (<FormItem><FormLabel>Father&apos;s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.motherName" render={({ field }) => (<FormItem><FormLabel>Mother&apos;s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.dob" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.gender" render={({ field }) => (<FormItem className="space-y-3"><FormLabel>Gender</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4"><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem><FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel className="font-normal">Other</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.maritalStatus" render={({ field }) => (<FormItem><FormLabel>Marital Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="single">Single</SelectItem><SelectItem value="married">Married</SelectItem><SelectItem value="divorced">Divorced</SelectItem><SelectItem value="widowed">Widowed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.religion" render={({ field }) => (<FormItem><FormLabel>Religion</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.caste" render={({ field }) => (<FormItem><FormLabel>Caste</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.children" render={({ field }) => (<FormItem><FormLabel>Children (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.bloodGroup" render={({ field }) => (<FormItem><FormLabel>Blood Group (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.identificationMark" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Identification Mark (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.pan" render={({ field }) => (<FormItem><FormLabel>PAN Number</FormLabel><FormControl><Input placeholder="ABCDE1234F" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="personalInfo.aadhaar" render={({ field }) => (<FormItem><FormLabel>Aadhaar Number</FormLabel><FormControl><Input placeholder="1234 5678 9012" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-secondary font-headline">Address Details</h3>
                    <div className="space-y-4">
                        <FormField control={form.control} name="address.permanent" render={({ field }) => (<FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Textarea placeholder="Enter your full permanent address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="sameAsPermanent" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Current address is the same as permanent address</FormLabel></div></FormItem>)} />
                        {!sameAsPermanent && (<FormField control={form.control} name="address.current" render={({ field }) => (<FormItem><FormLabel>Current Address</FormLabel><FormControl><Textarea placeholder="Enter your full current address" {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-secondary font-headline">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="bankDetails.bankName" render={({ field }) => (<FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="bankDetails.accountNumber" render={({ field }) => (<FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="bankDetails.ifsc" render={({ field }) => (<FormItem><FormLabel>IFSC Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="bankDetails.upi" render={({ field }) => (<FormItem><FormLabel>UPI ID (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="bankDetails.bankAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Bank Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-secondary font-headline">Nominee Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="nomineeDetails.nomineeName" render={({ field }) => (<FormItem><FormLabel>Nominee Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="nomineeDetails.nomineeFatherName" render={({ field }) => (<FormItem><FormLabel>Nominee&apos;s Father Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="nomineeDetails.relationship" render={({ field }) => (<FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="nomineeDetails.nomineeMobile" render={({ field }) => (<FormItem><FormLabel>Nominee Mobile Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="nomineeDetails.nomineeDob" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Nominee's Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    </div>
                  </div>
                  
                  <FormField control={form.control} name="termsAccepted" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>I agree to the Terms and Conditions</FormLabel><FormMessage /></div></FormItem>)} />

                  <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>Creating Account...</> : "Create an account"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}