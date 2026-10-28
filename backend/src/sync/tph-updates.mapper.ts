// Formato real do endpoint TPH/updates (TOTVS Protheus Monitor), validado em
// homologação em 2026-10-28. O campo relevante para `ProtheusPatch` é
// `packagesApplied`; `sourcesApplied` (arquivos-fonte individuais) e
// `binRecommended` (binários/infra recomendados) não têm modelo próprio
// ainda e são ignorados por enquanto.
export interface TphPackageDetail {
  source?: string;
  patchdate?: string;
  patchhour?: string;
}

export interface TphPackage {
  patchid?: string;
  issue?: string;
  module?: string;
  moduledetail?: string;
  generationdate?: string;
  versionprod?: string;
  tdnresume?: string;
  detail?: TphPackageDetail[];
}

export interface NormalizedPackage {
  moduleCode: string;
  version: string;
  description: string;
  appliedAt: Date;
  productVersion?: string;
}

export function mapTphPackage(raw: TphPackage): NormalizedPackage | null {
  const moduleCode = raw?.module?.trim();
  if (!raw?.patchid || !moduleCode) return null;

  const dateSource = raw.detail?.[0]?.patchdate ?? raw.generationdate;
  if (!dateSource) return null;
  const appliedAt = new Date(dateSource);
  if (Number.isNaN(appliedAt.getTime())) return null;

  const description = (raw.tdnresume || raw.issue || 'Pacote aplicado').trim();

  return {
    moduleCode: moduleCode.toUpperCase(),
    version: raw.patchid,
    description: description.length > 500 ? `${description.slice(0, 497)}...` : description,
    appliedAt,
    productVersion: raw.versionprod,
  };
}
