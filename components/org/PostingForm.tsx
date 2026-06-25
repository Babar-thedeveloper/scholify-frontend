"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Posting, ApplicationType } from "@/components/dashboard/dashboard.types";

interface PostingFormProps {
  type: ApplicationType;
  initialData?: Partial<Posting>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const DEGREE_LEVELS = ["Undergraduate", "Graduate", "PhD", "Post-doctorate", "School/College"];

export function PostingForm({
  type,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Posting",
  isSubmitting = false,
}: PostingFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    deadlineAt: initialData?.deadlineAt ? new Date(initialData.deadlineAt).toISOString().split("T")[0] : "",
    applyMethod: initialData?.applyMethod || "platform",
    externalUrl: initialData?.externalUrl || "",
    // Scholarship fields
    fundingAmount: initialData?.fundingAmount || "",
    degreeLevel: initialData?.degreeLevel || [],
    countryScope: initialData?.countryScope || "Pakistan",
    // Internship fields
    workMode: initialData?.workMode || "onsite",
    city: initialData?.city || "",
    isPaid: initialData?.isPaid !== undefined ? initialData.isPaid : true,
    stipend: initialData?.stipend || "",
    duration: initialData?.duration || "",
    startDate: initialData?.startDate || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDegreeLevelChange = (level: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.degreeLevel as string[];
      const next = checked
        ? [...current, level]
        : current.filter((l) => l !== level);
      return { ...prev, degreeLevel: next };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reconstruct deadline as ISO string if provided
    const deadlineISO = formData.deadlineAt
      ? new Date(`${formData.deadlineAt}T23:59:59Z`).toISOString()
      : undefined;

    const payload: any = {
      title: formData.title,
      description: formData.description,
      deadlineAt: deadlineISO,
      applyMethod: formData.applyMethod,
      externalUrl: formData.applyMethod === "external" ? formData.externalUrl : undefined,
    };

    if (type === "scholarship") {
      payload.fundingAmount = formData.fundingAmount;
      payload.degreeLevel = formData.degreeLevel;
      payload.countryScope = formData.countryScope;
    } else {
      payload.workMode = formData.workMode;
      payload.city = formData.workMode !== "remote" ? formData.city : undefined;
      payload.isPaid = formData.isPaid;
      payload.stipend = formData.isPaid ? formData.stipend : "Unpaid";
      payload.duration = formData.duration;
      payload.startDate = formData.startDate;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4 rounded-xl border border-border bg-white p-5 dark:bg-card">
        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
          Basic Details
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder={type === "scholarship" ? "e.g., Undergraduate Merit Scholarship 2026" : "e.g., Software Engineering Intern"}
            value={formData.title}
            onChange={handleChange}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder={
              type === "scholarship"
                ? "Describe eligibility criteria, coverage details, benefits, and how to apply..."
                : "Describe day-to-day responsibilities, requirements, skills needed, and learning opportunities..."
            }
            value={formData.description}
            onChange={handleChange}
            className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-xs placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="deadlineAt">Application Deadline</Label>
            <Input
              id="deadlineAt"
              name="deadlineAt"
              type="date"
              value={formData.deadlineAt}
              onChange={handleChange}
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applyMethod">Application Method</Label>
            <Select
              value={formData.applyMethod}
              onValueChange={(val) => handleSelectChange("applyMethod", val)}
            >
              <SelectTrigger id="applyMethod" className="h-10">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform">Native (Apply on Scholify)</SelectItem>
                <SelectItem value="external">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.applyMethod === "external" && (
          <div className="space-y-2">
            <Label htmlFor="externalUrl">External Application URL *</Label>
            <Input
              id="externalUrl"
              name="externalUrl"
              type="url"
              required
              placeholder="https://example.com/apply"
              value={formData.externalUrl}
              onChange={handleChange}
              className="h-10 text-sm"
            />
          </div>
        )}
      </div>

      {/* Internship-specific Fields */}
      {type === "internship" && (
        <div className="space-y-4 rounded-xl border border-border bg-white p-5 dark:bg-card">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Internship Specifications
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workMode">Work Mode</Label>
              <Select
                value={formData.workMode}
                onValueChange={(val) => handleSelectChange("workMode", val)}
              >
                <SelectTrigger id="workMode" className="h-10">
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.workMode !== "remote" && (
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  placeholder="e.g., Karachi, Lahore, Islamabad"
                  value={formData.city}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (e.g., 3 months) *</Label>
              <Input
                id="duration"
                name="duration"
                required
                placeholder="e.g., 3 months, 6 weeks"
                value={formData.duration}
                onChange={handleChange}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Target Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Paid Internship</Label>
                <p className="text-xs text-muted-foreground">
                  Does this internship provide a monetary stipend?
                </p>
              </div>
              <Switch
                checked={formData.isPaid}
                onCheckedChange={(checked) => handleSwitchChange("isPaid", checked)}
              />
            </div>

            {formData.isPaid && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="stipend">Stipend Amount *</Label>
                <Input
                  id="stipend"
                  name="stipend"
                  required
                  placeholder="e.g., PKR 45,000 / month"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="h-10 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scholarship-specific Fields */}
      {type === "scholarship" && (
        <div className="space-y-4 rounded-xl border border-border bg-white p-5 dark:bg-card">
          <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
            Scholarship Specifications
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fundingAmount">Funding Amount *</Label>
              <Input
                id="fundingAmount"
                name="fundingAmount"
                required
                placeholder="e.g., Fully funded, PKR 200,000 / year"
                value={formData.fundingAmount}
                onChange={handleChange}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryScope">Country / Region Scope *</Label>
              <Input
                id="countryScope"
                name="countryScope"
                required
                placeholder="e.g., Pakistan, United Kingdom, HEC-approved"
                value={formData.countryScope}
                onChange={handleChange}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Degree Levels</Label>
            <div className="grid grid-cols-2 gap-2 mt-1 sm:grid-cols-3">
              {DEGREE_LEVELS.map((level) => (
                <div key={level} className="flex items-center gap-2 rounded-lg border border-border bg-slate-50/50 p-2.5 dark:bg-slate-900/50">
                  <Checkbox
                    id={`deg-${level}`}
                    checked={(formData.degreeLevel as string[]).includes(level)}
                    onCheckedChange={(checked) =>
                      handleDegreeLevelChange(level, !!checked)
                    }
                  />
                  <Label
                    htmlFor={`deg-${level}`}
                    className="text-xs font-normal cursor-pointer select-none"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
