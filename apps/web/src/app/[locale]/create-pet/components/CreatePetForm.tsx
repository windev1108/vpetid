// app/create-pet/components/CreatePetForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Calendar, DateField, DatePicker, Input, Label, ListBox, Select } from "@heroui/react";

import { PetIdPreview } from "./PetIdPreview";
import { PetFormStepper } from "./PetFormStepper";
import { SectionHeading } from "./SectionHeading";
import { GenderToggle } from "./GenderToggle";
import { useCreatePet, useUpdatePet, useUploadPetAvatar } from "@/services/pets/mutations";
import { CreatePetPayload, Pet, PetGender } from "@/services/pets/types";
import { petFormSchema, PetFormValues, PET_FORM_DEFAULTS } from "../schema";
import { getMutateError } from "@/lib/utils";
import { parseDate } from "@internationalized/date";

const SPECIES_OPTIONS = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "other", label: "Other" },
];

const WEIGHT_UNIT_OPTIONS = [
    { value: "KG", label: "kg" },
    { value: "LBS", label: "lbs" },
];

const inputClass =
    "w-full rounded-lg border border-separator bg-surface px-3.5 py-2.5 font-body-md text-body-md text-foreground outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/40";
const errorInputClass = "border-danger focus:border-danger focus:ring-danger/30";
const labelClass = "mb-1.5 block font-label-sm text-label-sm font-medium text-muted";
const errorTextClass = "mt-1.5 font-label-sm text-label-sm text-danger";

function petToFormValues(pet?: Pet | null): PetFormValues {
    if (!pet) return PET_FORM_DEFAULTS;
    return {
        name: pet.name ?? "",
        species: pet.species ?? "",
        breed: pet.breed ?? "",
        gender: pet.gender ? (pet.gender.toLowerCase() as PetFormValues["gender"]) : undefined,
        birthdate: pet.dateOfBirth ? pet.dateOfBirth.slice(0, 10) : "",
        color: pet?.color ?? "",
        weight: pet?.weight ? String(pet?.weight) : "0",
        microchip: pet?.microchipNumber ? String(pet?.microchipNumber) : "",
        weightUnit: pet?.weightUnit ?? "KG",
        tagId: pet?.existingTagId ? pet?.existingTagId : "",
    };
}

type CreatePetFormProps = {
    /** Existing pet to prefill — presence of this switches the form into edit mode. */
    initPet?: Pet | null;
    onSaved: (pet: Pet) => void;
};

export function CreatePetForm({ initPet, onSaved }: CreatePetFormProps) {
    const mode = initPet ? "edit" : "create";

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initPet?.avatarUrl ?? null);

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(initPet?.coverUrl ?? null);


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset,
    } = useForm<PetFormValues>({
        resolver: zodResolver(petFormSchema),
        defaultValues: petToFormValues(initPet),
    });

    const { mutateAsync: createPet, isPending: isCreating } = useCreatePet();
    const { mutateAsync: updatePet, isPending: isUpdating } = useUpdatePet();
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadPetAvatar();

    const isPending = isCreating || isUpdating || isUploadingAvatar;

    const watchedName = watch("name");
    const watchedBreed = watch("breed");
    const watchedSpecies = watch("species");
    const watchedGender = watch("gender");
    const speciesLabel = SPECIES_OPTIONS.find((opt) => opt.value === watchedSpecies)?.label ?? "";
    const watchedWeightUnit = watch("weightUnit");

    function handlePhotoChange(file: File | null) {
        setPhotoFile(file);
        setPhotoPreview(file ? URL.createObjectURL(file) : initPet?.avatarUrl ?? null);
    }

    function handleCoverChange(file: File | null) {
        setCoverFile(file);
        setCoverPreview(file ? URL.createObjectURL(file) : initPet?.coverUrl ?? null);
    }

    useEffect(() => {
        if (initPet) {
            reset(petToFormValues(initPet));
            setPhotoPreview(initPet.avatarUrl ?? null);
            setCoverPreview(initPet.coverUrl ?? null);
        }
    }, [initPet, reset]);

    async function onSubmit(values: PetFormValues) {
        try {
            let avatarUrl = initPet?.avatarUrl ?? undefined;
            if (photoFile) {
                const { url } = await uploadAvatar(photoFile);
                avatarUrl = url;
            }

            let coverUrl = initPet?.coverUrl ?? undefined;
            if (coverFile) {
                const { url } = await uploadAvatar(coverFile);
                coverUrl = url;
            }

            const payload = {
                name: values.name.trim(),
                species: values.species,
                breed: values.breed?.trim() || undefined,
                gender: values.gender ? (values.gender.toUpperCase() as PetGender) : undefined,
                birthDate: values.birthdate || undefined,
                color: values.color || undefined,
                weight: Number(values.weight),
                weightUnit: values.weightUnit,
                microchipNumber: Number(values.microchip),
                existingTagId: values.tagId,
                avatarUrl,
                coverUrl,
            } as CreatePetPayload;

            const pet =
                mode === "edit" && initPet
                    ? await updatePet({ id: initPet.id, ...payload })
                    : await createPet(payload);

            onSaved(pet);
        } catch (error) {
            getMutateError(error)
        }
    }

    const handleReset = () => {
        reset(petToFormValues(initPet))
        setPhotoPreview(initPet?.avatarUrl ?? null);
        setCoverPreview(initPet?.coverUrl ?? null);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PetFormStepper activeStep={1} />

            <div className="relative flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-8">
                {/* Right column: merged upload + live preview — sticky to top-right */}
                <div className="w-full self-start lg:sticky lg:top-8 lg:w-[580px] lg:shrink-0">
                    <PetIdPreview
                        name={watchedName}
                        species={speciesLabel}
                        breed={watchedBreed ?? ""}
                        avatarUrl={photoPreview}
                        coverUrl={coverPreview}
                        onAvatarChange={handlePhotoChange}
                        onCoverChange={handleCoverChange}
                    />
                </div>

                <div className="flex flex-1 flex-col gap-6">
                    <section className="rounded-xl border border-separator bg-surface p-6 shadow-[0px_2px_12px_rgba(15,23,42,0.04)] md:p-7">
                        <SectionHeading
                            icon="pets"
                            title="Basic Information"
                            description="Tell us the basic details about your pet."
                        />
                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label htmlFor="name" className={labelClass}>
                                    Pet Name *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="e.g. Bella"
                                    className={`${inputClass} ${errors.name ? errorInputClass : ""}`}
                                    {...register("name")}
                                />
                                {errors.name && <p className={errorTextClass}>{errors.name.message}</p>}
                            </div>

                            <div>
                                <Controller
                                    name="species"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        const selectedSpecies = SPECIES_OPTIONS.find(
                                            (option) => option.value === field.value
                                        );

                                        return (
                                            <Select
                                                id="species"
                                                isRequired
                                                selectedKey={field.value || null}
                                                onSelectionChange={(key) => {
                                                    field.onChange(key?.toString() ?? "");
                                                }}
                                                onBlur={field.onBlur}
                                                className="w-full"
                                            >
                                                <Label>Species</Label>

                                                <Select.Trigger
                                                    className={
                                                        fieldState.error
                                                            ? errorInputClass
                                                            : ""
                                                    }
                                                >
                                                    <Select.Value>
                                                        {selectedSpecies?.label ?? "Select species"}
                                                    </Select.Value>

                                                    <Select.Indicator />
                                                </Select.Trigger>

                                                <Select.Popover>
                                                    <ListBox>
                                                        {SPECIES_OPTIONS.map((option) => (
                                                            <ListBox.Item
                                                                key={option.value}
                                                                id={option.value}
                                                                textValue={option.label}
                                                            >
                                                                {option.label}

                                                                <ListBox.ItemIndicator />
                                                            </ListBox.Item>
                                                        ))}
                                                    </ListBox>
                                                </Select.Popover>

                                                {fieldState.error && (
                                                    <p className={errorTextClass}>
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </Select>
                                        );
                                    }}
                                />
                                {/* <label htmlFor="species" className={labelClass}>
                                    Species *
                                </label>
                                <select
                                    id="species"
                                    className={`${inputClass} appearance-none ${errors.species ? errorInputClass : ""}`}

                                >
                                    <option value="" disabled>
                                        Select species
                                    </option>
                                    {SPECIES_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.species && <p className={errorTextClass}>{errors.species.message}</p>} */}
                            </div>

                            <div>
                                <label htmlFor="breed" className={labelClass}>
                                    Breed
                                </label>
                                <Input
                                    {...register("breed")}
                                    id="breed" aria-label="breed"
                                    className={inputClass}
                                    placeholder="e.g. Golden Retriever"
                                />

                                {/* <input
                                    id="breed"
                                    type="text"
                                    placeholder="e.g. Golden Retriever"
                                    className={inputClass}

                                /> */}
                            </div>

                            <div className="sm:col-span-1">
                                <label className={labelClass}>Gender</label>
                                <GenderToggle
                                    value={watchedGender}
                                    onChange={(v) => setValue("gender", v, { shouldValidate: true })}
                                />
                            </div>

                            <div className="sm:col-span-1">
                                <Controller
                                    name="birthdate"
                                    control={control}
                                    render={({ field, fieldState }) => {
                                        const dateValue = field.value
                                            ? parseDate(field.value)
                                            : null;

                                        return (
                                            <DatePicker
                                                className="w-full"
                                                value={dateValue}
                                                onChange={(date) => {
                                                    field.onChange(
                                                        date
                                                            ? date.toString()
                                                            : ""
                                                    );
                                                }}
                                                onBlur={field.onBlur}
                                            >
                                                <Label>Birthdate</Label>

                                                <DateField.Group fullWidth>
                                                    <DateField.Input
                                                        className={`${inputClass} ${fieldState.error
                                                            ? errorInputClass
                                                            : ""
                                                            }`}
                                                    >
                                                        {(segment) => (
                                                            <DateField.Segment
                                                                segment={segment}
                                                            />
                                                        )}
                                                    </DateField.Input>

                                                    <DateField.Suffix>
                                                        <DatePicker.Trigger>
                                                            <DatePicker.TriggerIndicator />
                                                        </DatePicker.Trigger>
                                                    </DateField.Suffix>
                                                </DateField.Group>

                                                <DatePicker.Popover>
                                                    <Calendar aria-label="Birthdate">
                                                        <Calendar.Header>
                                                            <Calendar.YearPickerTrigger>
                                                                <Calendar.YearPickerTriggerHeading />
                                                                <Calendar.YearPickerTriggerIndicator />
                                                            </Calendar.YearPickerTrigger>

                                                            <Calendar.NavButton slot="previous" />
                                                            <Calendar.NavButton slot="next" />
                                                        </Calendar.Header>

                                                        <Calendar.Grid>
                                                            <Calendar.GridHeader>
                                                                {(day) => (
                                                                    <Calendar.HeaderCell>
                                                                        {day}
                                                                    </Calendar.HeaderCell>
                                                                )}
                                                            </Calendar.GridHeader>

                                                            <Calendar.GridBody>
                                                                {(date) => (
                                                                    <Calendar.Cell
                                                                        date={date}
                                                                    />
                                                                )}
                                                            </Calendar.GridBody>
                                                        </Calendar.Grid>

                                                        <Calendar.YearPickerGrid>
                                                            <Calendar.YearPickerGridBody>
                                                                {({ year }) => (
                                                                    <Calendar.YearPickerCell
                                                                        year={year}
                                                                    />
                                                                )}
                                                            </Calendar.YearPickerGridBody>
                                                        </Calendar.YearPickerGrid>
                                                    </Calendar>
                                                </DatePicker.Popover>

                                                {fieldState.error && (
                                                    <p className={errorTextClass}>
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </DatePicker>
                                        );
                                    }}
                                />

                                {/* <label htmlFor="birthdate" className={labelClass}>
                                    Birthdate / Age
                                </label>
                                <input
                                    id="birthdate"
                                    type="date"
                                    className={`${inputClass} text-muted`}
                                    {...register("birthdate")}
                                /> */}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-separator bg-surface p-6 shadow-[0px_2px_12px_rgba(15,23,42,0.04)] md:p-7">
                        <SectionHeading
                            icon="straighten"
                            title="Physical Characteristics"
                            description="Add details about your pet's physical appearance."
                        />
                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-2">
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label htmlFor="color" className={labelClass}>
                                    Color &amp; Markings
                                </label>
                                <input
                                    id="color"
                                    type="text"
                                    placeholder="e.g. Black with white chest"
                                    className={inputClass}
                                    {...register("color")}
                                />
                            </div>

                            <div>
                                <label htmlFor="weight" className={labelClass}>
                                    Weight
                                </label>
                                <div className="flex">
                                    <input
                                        id="weight"
                                        min={0}
                                        step={0.1}
                                        placeholder="e.g. 4.5"
                                        className={`${inputClass} rounded-r-none ${errors.weight ? errorInputClass : ""}`}
                                        {...register("weight")}
                                    />
                                    <select
                                        {...register("weightUnit")}
                                        className="shrink-0 rounded-r-lg border border-l-0 border-separator bg-background-secondary px-4 font-label-md text-label-md text-foreground outline-none"
                                    >
                                        {WEIGHT_UNIT_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.weight && <p className={errorTextClass}>{errors.weight.message}</p>}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-separator bg-surface p-6 shadow-[0px_2px_12px_rgba(15,23,42,0.04)] md:p-7">
                        <SectionHeading
                            icon="memory"
                            title="Identification"
                            description="Add identification details to help keep your pet safe."
                        />
                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="microchip" className={labelClass}>
                                    Microchip Number
                                </label>
                                <input
                                    id="microchip"
                                    type="text"
                                    placeholder="15-digit number"
                                    className={`${inputClass} rounded-r-none ${errors.microchip ? errorInputClass : ""}`}
                                    {...register("microchip")}
                                />
                                {errors.microchip && <p className={errorTextClass}>{errors.microchip.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="tagId" className={labelClass}>
                                    Existing Tag ID (Optional)
                                </label>
                                <input
                                    id="tagId"
                                    type="text"
                                    placeholder="e.g. City License"
                                    className={inputClass}
                                    {...register("tagId")}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Desktop actions dưới cùng form, ngay dưới Identification — khớp vị trí trong design */}
                    <div className="hidden justify-end gap-4 md:flex">
                        <Button onClick={handleReset} type="button" variant="outline" className="px-6">
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            isPending={isPending}
                            className="gap-2 bg-accent px-6 font-label-md text-label-md font-semibold text-accent-foreground hover:bg-[color:var(--color-accent-hover)]"
                        >
                            Save &amp; Continue
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile actions */}
            <div className="fixed bottom-0 left-0 z-50 flex w-full gap-4 border-t border-separator bg-surface p-4 shadow-[0px_-4px_20px_rgba(15,23,42,0.05)] md:hidden">
                <Button onClick={handleReset} type="button" variant="outline" className="flex-1">
                    Reset
                </Button>
                <Button type="submit" isPending={isPending} className="flex-1 gap-2 bg-accent text-accent-foreground">
                    {mode === "edit" ? "Save Changes" : "Save & Continue"}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Button>
            </div>
        </form>
    );
}