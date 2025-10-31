"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormData, predefinedProfiles } from "@/data/profiles";
import API_CONFIG from "@/lib/api-config";


const initialFormData: FormData = {
  sex: "",
  marrital_status: "",
  age: 0,
  n_of_liables: 0,
  job: "",
  foreign_worker: 0,
  present_employee_since: "",
  telephone: 0,
  housing: "",
  present_residence_since: 0,
  property: "",
  checking_account: "",
  savings: "",
  purpose: "",
  credit_history: 0,
  duration: 0,
  credit_amount: 0,
  guarantors: "",
  other_installment_plans: "",
  credits_at_bank: 0,
};


interface PredictorFormProps {
  onResultsChange: (
    results: Record<string, string> | { error: string }
  ) => void;
  onInputDataChange: (inputData: Record<string, any>) => void;
}

export function PredictorForm({
  onResultsChange,
  onInputDataChange,
}: PredictorFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProfileSelect = (profileId: string) => {
    if (profileId === "no-profile") {
      setFormData(initialFormData);
      setSelectedProfile("");
      // Clear all errors when no profile is selected
      setErrors({});
    } else {
      const profile = predefinedProfiles.find((p) => p.id === profileId);
      if (profile) {
        setFormData(profile.formData);
        setSelectedProfile(profileId);
        // Clear all errors when profile is selected
        setErrors({});
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required string fields
    const requiredStringFields: (keyof FormData)[] = [
      "sex",
      "marrital_status",
      "job",
      "present_employee_since",
      "housing",
      "property",
      "checking_account",
      "savings",
      "purpose",
      "guarantors",
      "other_installment_plans",
    ];

    requiredStringFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = "Este campo é obrigatório";
      }
    });

    // Required numeric fields
    const requiredNumericFields: (keyof FormData)[] = [
      "age",
      "n_of_liables",
      "foreign_worker",
      "telephone",
      "present_residence_since",
      "credit_history",
      "duration",
      "credit_amount",
      "credits_at_bank",
    ];

    requiredNumericFields.forEach((field) => {
      const value = formData[field];
      if (value === undefined || value === null) {
        newErrors[field] = "Este campo é obrigatório";
      } else if (typeof value === "number" && value < 0) {
        newErrors[field] = "Valor deve ser positivo";
      }
    });

    // Specific validations
    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      newErrors.age = "Idade deve estar entre 18 e 100 anos";
    }

    if (formData.credit_amount && formData.credit_amount < 0) {
      newErrors.credit_amount = "Valor do crédito deve ser positivo";
    }

    if (
      formData.duration &&
      (formData.duration < 1 || formData.duration > 120)
    ) {
      newErrors.duration = "Duração deve estar entre 1 e 120 meses";
    }

    if (
      formData.credit_history &&
      (formData.credit_history < 1 || formData.credit_history > 5)
    ) {
      newErrors.credit_history = "Histórico de crédito deve estar entre 1 e 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Pass input data to parent for SHAP visualization
      onInputDataChange(formData);

      const response = await fetch(`${API_CONFIG.SHAP_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const predictionResults = await response.json();
      onResultsChange(predictionResults);
    } catch (error) {
      console.error("Error making prediction:", error);
      onResultsChange({ error: "Erro ao fazer predição. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selecionar Perfil</h3>
          <p className="text-sm text-gray-400">
            Escolha um perfil predefinido para preencher automaticamente o
            formulário, ou preencha manualmente.
          </p>

          <Select value={selectedProfile} onValueChange={handleProfileSelect}>
             <SelectTrigger className="w-100 h-auto min-h-20">
               {selectedProfile ? (
                 (() => {
                   if (selectedProfile === "no-profile") {
                     return (
                       <div className="flex items-center p-3 w-full">
                         <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                           <AvatarFallback className="bg-gray-100 text-gray-600">
                             <User className="h-5 w-5" />
                           </AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col flex-1 min-w-0 text-left">
                           <span className="font-medium text-xs">
                             Sem Perfil
                           </span>
                           <span className="text-xs text-gray-500">
                             Preenchimento manual
                           </span>
                           <span className="text-xs text-gray-400 leading-tight">
                             Preencha todos os campos manualmente
                           </span>
                         </div>
                       </div>
                     );
                   }
                   const profile = predefinedProfiles.find(p => p.id === selectedProfile);
                   return profile ? (
                     <div className="flex items-center p-3 w-full">
                       <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                         {profile.photo ? (
                           <AvatarImage 
                             src={profile.photo} 
                             alt={profile.name}
                             className="object-contain"
                           />
                         ) : null}
                         <AvatarFallback className="bg-blue-100 text-blue-600">
                           <User className="h-5 w-5" />
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col flex-1 min-w-0 text-left">
                         <span className="font-medium text-xs">
                           {profile.name}
                         </span>
                         <span className="text-xs text-gray-500">
                           {profile.age} anos
                         </span>
                         <span className="text-xs text-gray-400 leading-tight">
                           {profile.description}
                         </span>
                       </div>
                     </div>
                   ) : null;
                 })()
               ) : (
                 <SelectValue placeholder="Selecione um perfil ou preencha manualmente" />
               )}
             </SelectTrigger>
            <SelectContent className="w-100 max-w-none">
              <SelectItem key="no-profile" value="no-profile" className="p-0">
                <div className="flex items-center p-3 w-full h-20 hover:bg-gray-50">
                  <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-xs">
                      Sem Perfil
                    </span>
                    <span className="text-xs text-gray-500">
                      Preenchimento manual
                    </span>
                    <span className="text-xs text-gray-400 leading-tight">
                      Preencha todos os campos manualmente
                    </span>
                  </div>
                </div>
              </SelectItem>
              {predefinedProfiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id} className="p-0">
                  <div className="flex items-center p-3 w-full h-20 hover:bg-gray-50">
                    <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                       {profile.photo ? (
                         <AvatarImage 
                           src={profile.photo} 
                           alt={profile.name}
                           className="object-contain"
                         />
                       ) : null}
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-xs">
                        {profile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {profile.age} anos
                      </span>
                      <span className="text-xs text-gray-400 leading-tight">
                        {profile.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Pessoais</h3>

          <div className="grid grid-cols-2 gap-4">
            <div >
              <Label  htmlFor="sex">Sexo</Label>
              <Select
                value={formData.sex}
                onValueChange={(value) => handleInputChange("sex", value)}
              >
                <SelectTrigger className={(errors.sex ? "border-red-500" : "") + " mt-2"}>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
              {errors.sex && (
                <p className="text-sm text-red-500 mt-1">{errors.sex}</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) =>
                  handleInputChange("age", parseInt(e.target.value) || 0)
                }
                placeholder="Digite a idade"
                className={(errors.age ? "border-red-500" : "") + " mt-2"}
              />
              {errors.age && (
                <p className="text-sm text-red-500 mt-1">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marrital_status">Estado Civil</Label>
              <Select
                value={formData.marrital_status}
                onValueChange={(value) =>
                  handleInputChange("marrital_status", value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Solteiro(a)</SelectItem>
                  <SelectItem value="married/widowed">
                    Casado(a)/Viúvo(a)
                  </SelectItem>
                  <SelectItem value="divorced">Divorciado(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="n_of_liables">Número de Dependentes</Label>
              <Input
                id="n_of_liables"
                type="number"
                value={formData.n_of_liables || ""}
                onChange={(e) =>
                  handleInputChange(
                    "n_of_liables",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Número de dependentes"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Profissionais</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job">Tipo de Emprego</Label>
              <Select
                value={formData.job}
                onValueChange={(value) => handleInputChange("job", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o tipo de emprego" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unemployed/unskilled non-resident">
                    Desempregado/Não qualificado não residente
                  </SelectItem>
                  <SelectItem value="unskilled resident">
                    Não qualificado residente
                  </SelectItem>
                  <SelectItem value="qualified">Qualificado</SelectItem>
                  <SelectItem value="highly qualified">
                    Altamente qualificado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="present_employee_since">
                Tempo no Emprego Atual
              </Label>
              <Select
                value={formData.present_employee_since}
                onValueChange={(value) =>
                  handleInputChange("present_employee_since", value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unemployed">Desempregado</SelectItem>
                  <SelectItem value="<1y">Menos de 1 ano</SelectItem>
                  <SelectItem value="1-4y">1-4 anos</SelectItem>
                  <SelectItem value="4-7y">4-7 anos</SelectItem>
                  <SelectItem value=">=7y">7+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foreign_worker">Trabalhador Estrangeiro</Label>
              <Select
                value={formData.foreign_worker.toString()}
                onValueChange={(value) =>
                  handleInputChange("foreign_worker", parseInt(value))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não</SelectItem>
                  <SelectItem value="1">Sim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="telephone">Telefone</Label>
              <Select
                value={formData.telephone.toString()}
                onValueChange={(value) =>
                  handleInputChange("telephone", parseInt(value))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Não possui</SelectItem>
                  <SelectItem value="1">Possui</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Housing Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações de Moradia</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="housing">Tipo de Moradia</Label>
              <Select
                value={formData.housing}
                onValueChange={(value) => handleInputChange("housing", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Própria</SelectItem>
                  <SelectItem value="rent">Alugada</SelectItem>
                  <SelectItem value="for free">Gratuita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="present_residence_since">
                Tempo na Residência Atual
              </Label>
              <Input
                id="present_residence_since"
                type="number"
                value={formData.present_residence_since || ""}
                onChange={(e) =>
                  handleInputChange(
                    "present_residence_since",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Anos na residência atual"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="property">Propriedade</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tipo de propriedade que o solicitante possui</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Imóvel, veículo, seguro de vida ou nenhuma
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={formData.property}
              onValueChange={(value) => handleInputChange("property", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione a propriedade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real estate">Imóvel</SelectItem>
                <SelectItem value="building society / life insurance">
                  Sociedade de Construção/Seguro de Vida
                </SelectItem>
                <SelectItem value="car or other">Carro ou outro</SelectItem>
                <SelectItem value="unk. / no property">
                  Desconhecido/Sem propriedade
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Financeiras</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checking_account">Conta Corrente</Label>
              <Select
                value={formData.checking_account}
                onValueChange={(value) =>
                  handleInputChange("checking_account", value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no checking account">
                    Sem conta corrente
                  </SelectItem>
                  <SelectItem value="< 0 DM">Negativo</SelectItem>
                  <SelectItem value="0 <= ... < 200 DM">0-200 DM</SelectItem>
                  <SelectItem value=">= 200 DM">200+ DM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="savings">Poupança</Label>
              <Select
                value={formData.savings}
                onValueChange={(value) => handleInputChange("savings", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0 or unk.">0 ou desconhecido</SelectItem>
                  <SelectItem value="<100 DM">Menos de 100 DM</SelectItem>
                  <SelectItem value="100-500 DM">100-500 DM</SelectItem>
                  <SelectItem value="500-1000 DM">500-1000 DM</SelectItem>
                  <SelectItem value=">1000 DM">Mais de 1000 DM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="credit_amount">Valor do Crédito</Label >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-300 cursor-help"  />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor solicitado para o crédito em DM (Deutsche Mark)</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Valores típicos: 250-19.000 DM
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="credit_amount"
                type="number"
                value={formData.credit_amount || ""}
                onChange={(e) =>
                  handleInputChange(
                    "credit_amount",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Valor em DM"
                className={(errors.credit_amount ? "border-red-500" : ""  ) + " mt-2"}
              />
              {errors.credit_amount && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.credit_amount}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="duration">Duração (meses)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Prazo para pagamento do crédito em meses</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Valores típicos: 4-72 meses
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="duration"
                type="number"
                value={formData.duration || ""}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value) || 0)
                }
                placeholder="Duração em meses"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="credit_history">Histórico de Crédito</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Classificação do histórico de crédito</p>
                    <p className="text-xs text-gray-300 mt-1">
                      1=Nenhum crédito/pagos, 2=Todos pagos neste banco,
                      3=Créditos pagos até agora, 4=Atraso no passado, 5=Conta
                      crítica/outros créditos
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="credit_history"
                type="number"
                value={formData.credit_history || ""}
                onChange={(e) =>
                  handleInputChange(
                    "credit_history",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Histórico de crédito"
                className={(errors.credit_history ? "border-red-500" : "") + " mt-2"}
              />
              {errors.credit_history && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.credit_history}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="credits_at_bank">Créditos no Banco</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número de créditos existentes no banco</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Valores típicos: 1-4 créditos
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="credits_at_bank"
                type="number"
                value={formData.credits_at_bank || ""}
                onChange={(e) =>
                  handleInputChange(
                    "credits_at_bank",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Número de créditos"
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Adicionais</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purpose">Finalidade do Crédito</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange("purpose", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione a finalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new car">Carro novo</SelectItem>
                  <SelectItem value="used car">Carro usado</SelectItem>
                  <SelectItem value="domestic appliances">
                    Eletrodomésticos
                  </SelectItem>
                  <SelectItem value="business">Negócios</SelectItem>
                  <SelectItem value="radio/television">
                    Rádio/Televisão
                  </SelectItem>
                  <SelectItem value="education">Educação</SelectItem>
                  <SelectItem value="furniture/equipment">
                    Móveis/Equipamentos
                  </SelectItem>
                  <SelectItem value="repairs">Reparos</SelectItem>
                  <SelectItem value="retraining">Reciclagem</SelectItem>
                  <SelectItem value="others">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guarantors">Fiadores</Label>
              <Select
                value={formData.guarantors}
                onValueChange={(value) =>
                  handleInputChange("guarantors", value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="guarantor">Tem fiador</SelectItem>
                  <SelectItem value="co-applicant">Co-solicitante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="other_installment_plans">
                Outros Planos de Pagamento
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Outros planos de pagamento em prestações</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Nenhum, lojas ou banco
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={formData.other_installment_plans}
              onValueChange={(value) =>
                handleInputChange("other_installment_plans", value)
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                <SelectItem value="stores">Lojas</SelectItem>
                <SelectItem value="bank">Banco</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full bg-[#4538FF] hover:bg-[#372ccc] text-white" disabled={isLoading}>
          {isLoading ? "Processando..." : "Fazer Predição"}
        </Button>
      </form>
    </TooltipProvider>
  );
}
