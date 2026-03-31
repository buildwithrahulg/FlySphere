import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    const router = new Router();
    window.location.href = '/login';
    return false;
  }
};
