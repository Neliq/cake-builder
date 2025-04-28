"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Stepper } from "@/components/stepper";
import {
  Truck,
  Building2,
  Store,
  User2,
  MapPin,
  CreditCardIcon,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import type { CustomerDetails, DeliveryDetails } from "@/types/cart";

// Form validation schema
const formSchema = z
  .object({
    // Customer type selection
    customerType: z.enum(["person", "company"]),

    // Delivery method
    deliveryMethod: z.enum(["shipping", "pickup"]),

    // Basic contact info
    firstName: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
    lastName: z.string().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
    email: z.string().email("Podaj prawidłowy adres email"),
    phone: z.string().min(9, "Numer telefonu musi mieć co najmniej 9 cyfr"),

    // Company info (optional based on customer type)
    companyName: z.string().optional(),
    nip: z.string().optional(),

    // Address fields (optional based on delivery method)
    street: z.string().optional(),
    buildingNumber: z.string().optional(),
    apartmentNumber: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),

    // Pickup location (required if delivery method is pickup)
    pickupLocation: z.string().optional(),

    // Delivery date and time (required for both methods)
    deliveryDate: z.date({
      required_error: "Proszę wybrać datę",
    }),
    deliveryTime: z.string({
      required_error: "Proszę wybrać godzinę",
    }),

    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // If shipping is selected, address fields are required
      if (data.deliveryMethod === "shipping") {
        return (
          !!data.street &&
          !!data.buildingNumber &&
          !!data.city &&
          !!data.zipCode
        );
      }
      return true;
    },
    {
      message: "Adres jest wymagany dla dostawy",
      path: ["street"],
    }
  )
  .refine(
    (data) => {
      // If pickup is selected, pickupLocation is required
      if (data.deliveryMethod === "pickup") {
        return !!data.pickupLocation;
      }
      return true;
    },
    {
      message: "Wybierz lokalizację odbioru",
      path: ["pickupLocation"],
    }
  )
  .refine(
    (data) => {
      // If company is selected, company name and NIP are required
      if (data.customerType === "company") {
        return !!data.companyName && !!data.nip;
      }
      return true;
    },
    {
      message: "Dane firmy są wymagane",
      path: ["companyName"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function Dostawa() {
  const router = useRouter();
  const {
    items,
    customerDetails,
    deliveryDetails,
    setCustomerDetails,
    setDeliveryDetails,
  } = useCart();

  // Track the delivery method separately to conditionally render UI elements
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">(
    deliveryDetails?.deliveryMethod || "shipping"
  );
  const [customerType, setCustomerType] = useState<"person" | "company">(
    customerDetails?.customerType || "person"
  );

  // Available time slots
  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
  ];

  // Pickup locations
  const pickupLocations = [
    "Cukiernia Centrum - ul. Marszałkowska 45, Warszawa",
    "Cukiernia Północ - ul. Mickiewicza 22, Warszawa",
    "Cukiernia Południe - ul. Puławska 130, Warszawa",
  ];

  // Calculate min date (tomorrow) and max date (30 days from now)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerType: customerDetails?.customerType || "person",
      deliveryMethod: deliveryDetails?.deliveryMethod || "shipping",
      firstName: customerDetails?.firstName || "",
      lastName: customerDetails?.lastName || "",
      email: customerDetails?.email || "",
      phone: customerDetails?.phone || "",
      companyName: customerDetails?.companyName || "",
      nip: customerDetails?.nip || "",
      street: deliveryDetails?.address?.street || "",
      buildingNumber: deliveryDetails?.address?.buildingNumber || "",
      apartmentNumber: deliveryDetails?.address?.apartmentNumber || "",
      city: deliveryDetails?.address?.city || "",
      zipCode: deliveryDetails?.address?.zipCode || "",
      pickupLocation: deliveryDetails?.pickupLocation || "",
      deliveryDate:
        deliveryDetails?.deliveryDate instanceof Date
          ? deliveryDetails.deliveryDate
          : deliveryDetails?.deliveryDate
          ? new Date(deliveryDetails.deliveryDate)
          : undefined,
      deliveryTime: deliveryDetails?.deliveryTime || "",
      notes: deliveryDetails?.notes || "",
    },
  });

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/koszyk");
    }
  }, [items, router]);

  // Update local state when form fields change
  form.watch((data, { name }) => {
    if (name === "deliveryMethod" && data.deliveryMethod) {
      setDeliveryMethod(data.deliveryMethod as "shipping" | "pickup");
    }
    if (name === "customerType" && data.customerType) {
      setCustomerType(data.customerType as "person" | "company");
    }
  });

  function onSubmit(data: FormValues) {
    // Save customer details
    const customerData: CustomerDetails = {
      customerType: data.customerType,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      companyName:
        data.customerType === "company" ? data.companyName : undefined,
      nip: data.customerType === "company" ? data.nip : undefined,
    };

    // Save delivery details
    const deliveryData: DeliveryDetails = {
      deliveryMethod: data.deliveryMethod,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      notes: data.notes,
      address:
        data.deliveryMethod === "shipping"
          ? {
              street: data.street || "",
              buildingNumber: data.buildingNumber || "",
              apartmentNumber: data.apartmentNumber,
              city: data.city || "",
              zipCode: data.zipCode || "",
            }
          : undefined,
      pickupLocation:
        data.deliveryMethod === "pickup" ? data.pickupLocation : undefined,
    };

    // Update context directly
    setCustomerDetails(customerData);
    setDeliveryDetails(deliveryData);

    // Navigate to summary
    router.push("/koszyk/podsumowanie");
  }

  return (
    <div>
      <Navbar />
      <Stepper
        currentStep={2}
        steps={["Koszyk", "Dostawa", "Podsumowanie"]}
        icons={[
          <ShoppingBag className="h-4 w-4" key="cart" />,
          <Truck className="h-4 w-4" key="truck" />,
          <CreditCardIcon className="h-4 w-4" key="checkout" />,
        ]}
      />

      <div className="max-w-4xl mx-auto my-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Informacje o dostawie</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Delivery method selection */}
            <Card>
              <CardHeader>
                <CardTitle>Sposób odbioru</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="shipping" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Truck className="h-4 w-4 mr-2" />
                              Dostawa do domu
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="pickup" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Store className="h-4 w-4 mr-2" />
                              Odbiór osobisty
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Customer type selection */}
            <Card>
              <CardHeader>
                <CardTitle>Typ klienta</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="customerType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="person" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <User2 className="h-4 w-4 mr-2" />
                              Osoba prywatna
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="company" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Building2 className="h-4 w-4 mr-2" />
                              Firma
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dane odbiorcy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Company fields - shown only when company is selected */}
                  {customerType === "company" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Nazwa firmy *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nazwa Sp. z o.o."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NIP *</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Personal information - always shown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imię *</FormLabel>
                          <FormControl>
                            <Input placeholder="Jan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwisko *</FormLabel>
                          <FormControl>
                            <Input placeholder="Kowalski" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jan.kowalski@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="48123456789"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address section - only shown if shipping is selected */}
            {deliveryMethod === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Adres dostawy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Ulica *</FormLabel>
                          <FormControl>
                            <Input placeholder="Marszałkowska" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buildingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numer budynku *</FormLabel>
                          <FormControl>
                            <Input placeholder="42" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apartmentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numer mieszkania</FormLabel>
                          <FormControl>
                            <Input placeholder="10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Miasto *</FormLabel>
                          <FormControl>
                            <Input placeholder="Warszawa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kod pocztowy *</FormLabel>
                          <FormControl>
                            <Input placeholder="00-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pickup location - only shown if pickup is selected */}
            {deliveryMethod === "pickup" && (
              <Card>
                <CardHeader>
                  <CardTitle>Miejsce odbioru</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="pickupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wybierz cukiernię *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz lokalizację" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pickupLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <FormDescription className="flex items-center mt-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          Odbiór osobisty bez dodatkowych opłat
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>
                  {deliveryMethod === "shipping"
                    ? "Termin dostawy"
                    : "Termin odbioru"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          {deliveryMethod === "shipping"
                            ? "Data dostawy *"
                            : "Data odbioru *"}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(
                                    field.value instanceof Date
                                      ? field.value
                                      : new Date(field.value),
                                    "PPP",
                                    { locale: pl }
                                  )
                                ) : (
                                  <span>Wybierz datę</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < tomorrow || date > maxDate
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Możliwy odbiór od jutra do 30 dni w przyszłość
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {deliveryMethod === "shipping"
                            ? "Preferowana godzina dostawy *"
                            : "Preferowana godzina odbioru *"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz godzinę" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Uwagi do zamówienia</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              deliveryMethod === "shipping"
                                ? "Np. kod do bramy, piętro, szczegóły dotyczące dostawy..."
                                : "Np. dodatkowe informacje dot. odbioru..."
                            }
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Wróć do koszyka
              </Button>

              <Button type="submit">Przejdź do podsumowania</Button>
            </div>
          </form>
        </Form>
      </div>

      <Footer />
    </div>
  );
}
