import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiUsersWithRoles, ApiPhotoForApprovalDto, ApiPhotoDto } from 'src/api-models';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpUserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
  ) {}

  getUsersWithRole() {
    const requestUrl = this.apiUrl + 'Admin/users-with-roles';
    return this.http.get<ApiUsersWithRoles[]>(requestUrl);
  }

  updateUserRoles(userUpdate: ApiUsersWithRoles) {
    const requestUrl = this.apiUrl + 'Admin/edit-roles/' + userUpdate.username;
    let params = new HttpParams()
      .append('roles', userUpdate.roles.join(','));
    return this.http.post<string[]>(requestUrl, {}, { params });
  }

  getPhotosToModerate() {
    const requestUrl = this.apiUrl + 'Admin/photos-to-moderate';
    return this.http.get<ApiPhotoForApprovalDto[]>(requestUrl);
  }

  approvePhoto(photoId: number) {
    const requestUrl = this.apiUrl + 'Admin/approve-photo/' + photoId;
    return this.http.put<ApiPhotoDto>(requestUrl, {});
  }

  removePhoto(photoId: number) {
    const requestUrl = this.apiUrl + 'Admin/remove-photo/' + photoId;
    return this.http.delete<ApiPhotoDto>(requestUrl);
  }
}